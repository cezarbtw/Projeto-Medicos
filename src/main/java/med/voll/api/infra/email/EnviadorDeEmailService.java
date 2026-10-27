package med.voll.api.infra.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import med.voll.api.domain.consulta.Consulta;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;

@Service
public class EnviadorDeEmailService implements EmailService {

    private static final Logger log = LoggerFactory.getLogger(EnviadorDeEmailService.class);
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy 'às' HH:mm");

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${api.mail.from:nao-responder@mediclin.med.br}")
    private String remetente;

    @Value("${api.mail.enabled:true}")
    private boolean habilitado;

    @Override
    @Async
    public void enviarEmailConfirmacaoAgendamento(Consulta consulta) {
        if (!deveEnviar()) return;

        try {
            var dataFormatada = consulta.getData().format(FORMATTER);
            var nomePaciente = consulta.getPaciente().getNome();
            var nomeMedico = consulta.getMedico().getNome();
            var especialidade = consulta.getMedico().getEspecialidade() != null
                    ? consulta.getMedico().getEspecialidade().toString()
                    : "Clínica Geral";

            var assunto = String.format("Confirmação de Consulta - MediClin - %s", dataFormatada);
            var html = construirTemplateConfirmacao(nomePaciente, nomeMedico, especialidade, dataFormatada);

            var emailPaciente = consulta.getPaciente().getEmail();
            if (emailPaciente != null && !emailPaciente.isBlank()) {
                disparar(emailPaciente, assunto, html);
            }

            var emailMedico = consulta.getMedico().getEmail();
            if (emailMedico != null && !emailMedico.isBlank() && !emailMedico.equalsIgnoreCase(emailPaciente)) {
                var assuntoMedico = String.format("Novo Agendamento Confirmado - MediClin - %s", dataFormatada);
                disparar(emailMedico, assuntoMedico, html);
            }
        } catch (Exception e) {
            log.warn("Falha ao preparar/enviar e-mail de confirmação de agendamento: {}", e.getMessage());
        }
    }

    @Override
    @Async
    public void enviarEmailCancelamento(Consulta consulta) {
        if (!deveEnviar()) return;

        try {
            var dataFormatada = consulta.getData().format(FORMATTER);
            var nomePaciente = consulta.getPaciente().getNome();
            var nomeMedico = consulta.getMedico().getNome();
            var motivo = consulta.getMotivoCancelamento() != null
                    ? consulta.getMotivoCancelamento().toString()
                    : "Não especificado";

            var assunto = String.format("Aviso de Cancelamento de Consulta - MediClin - %s", dataFormatada);
            var html = construirTemplateCancelamento(nomePaciente, nomeMedico, dataFormatada, motivo);

            var emailPaciente = consulta.getPaciente().getEmail();
            if (emailPaciente != null && !emailPaciente.isBlank()) {
                disparar(emailPaciente, assunto, html);
            }

            var emailMedico = consulta.getMedico().getEmail();
            if (emailMedico != null && !emailMedico.isBlank() && !emailMedico.equalsIgnoreCase(emailPaciente)) {
                disparar(emailMedico, assunto, html);
            }
        } catch (Exception e) {
            log.warn("Falha ao preparar/enviar e-mail de cancelamento: {}", e.getMessage());
        }
    }

    private boolean deveEnviar() {
        if (!habilitado) {
            log.info("Disparo de e-mails desabilitado pelas propriedades (api.mail.enabled=false).");
            return false;
        }
        if (mailSender == null) {
            log.warn("JavaMailSender não está disponível no contexto. O e-mail não será enviado.");
            return false;
        }
        return true;
    }

    private void disparar(String destinatario, String assunto, String html) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, StandardCharsets.UTF_8.name());

            helper.setFrom(remetente);
            helper.setTo(destinatario);
            helper.setSubject(assunto);
            helper.setText(html, true);

            mailSender.send(message);
            log.info("E-mail enviado com sucesso para: {} com o assunto: '{}'", destinatario, assunto);
        } catch (MessagingException e) {
            log.warn("Erro ao configurar mensagem de e-mail para {}: {}", destinatario, e.getMessage());
        } catch (Exception e) {
            log.warn("Erro ao disparar e-mail para {}: {}", destinatario, e.getMessage());
        }
    }

    private String construirTemplateConfirmacao(String paciente, String medico, String especialidade, String dataHora) {
        return "<!DOCTYPE html>"
                + "<html lang=\"pt-BR\">"
                + "<head><meta charset=\"UTF-8\"></head>"
                + "<body style=\"margin: 0; padding: 20px; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;\">"
                + "  <div style=\"max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 12px rgba(15,23,42,0.06); border: 1px solid #e2e8f0;\">"
                + "    <div style=\"background: linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%); padding: 32px 24px; text-align: center; color: #ffffff;\">"
                + "      <h1 style=\"margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;\">MediClin</h1>"
                + "      <p style=\"margin: 6px 0 0; font-size: 13.5px; opacity: 0.9;\">Gestão Hospitalar & Atendimento Clínico</p>"
                + "    </div>"
                + "    <div style=\"padding: 28px 24px;\">"
                + "      <h2 style=\"margin: 0 0 12px; font-size: 18px; color: #0f172a;\">Consulta Confirmada com Sucesso!</h2>"
                + "      <p style=\"margin: 0 0 20px; font-size: 14px; color: #64748b; line-height: 1.5;\">Olá, <strong>" + paciente + "</strong>. Seu agendamento foi registrado em nossa plataforma. Confira abaixo os detalhes:</p>"
                + "      <div style=\"background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px; margin-bottom: 22px;\">"
                + "        <table style=\"width: 100%; border-collapse: collapse; font-size: 13.5px;\">"
                + "          <tr><td style=\"padding: 6px 0; color: #64748b;\">Profissional:</td><td style=\"padding: 6px 0; font-weight: 600; color: #0f172a; text-align: right;\">" + medico + "</td></tr>"
                + "          <tr><td style=\"padding: 6px 0; color: #64748b;\">Especialidade:</td><td style=\"padding: 6px 0; font-weight: 600; color: #0f172a; text-align: right;\">" + especialidade + "</td></tr>"
                + "          <tr><td style=\"padding: 6px 0; color: #64748b;\">Data e Horário:</td><td style=\"padding: 6px 0; font-weight: 700; color: #4f46e5; text-align: right;\">" + dataHora + "</td></tr>"
                + "        </table>"
                + "      </div>"
                + "      <div style=\"background-color: #eef2ff; border-left: 4px solid #4f46e5; border-radius: 4px; padding: 12px 14px; margin-bottom: 20px;\">"
                + "        <p style=\"margin: 0; font-size: 12.5px; color: #3730a3; line-height: 1.4;\"><strong>Orientações:</strong> Solicitamos chegar com 15 minutos de antecedência munido de documento oficial com foto e carteira de convênio (se aplicável).</p>"
                + "      </div>"
                + "      <p style=\"margin: 0; font-size: 13px; color: #64748b;\">Caso necessite cancelar ou reagendar, acesse o portal ou entre em contato com pelo menos 24 horas de antecedência.</p>"
                + "    </div>"
                + "    <div style=\"border-top: 1px solid #e2e8f0; padding: 18px 24px; text-align: center; background-color: #fafbfc; font-size: 11.5px; color: #94a3b8;\">"
                + "      <p style=\"margin: 0;\">Este é um e-mail automático gerado pelo sistema MediClin. Por favor, não responda.</p>"
                + "    </div>"
                + "  </div>"
                + "</body>"
                + "</html>";
    }

    private String construirTemplateCancelamento(String paciente, String medico, String dataHora, String motivo) {
        return "<!DOCTYPE html>"
                + "<html lang=\"pt-BR\">"
                + "<head><meta charset=\"UTF-8\"></head>"
                + "<body style=\"margin: 0; padding: 20px; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;\">"
                + "  <div style=\"max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 12px rgba(15,23,42,0.06); border: 1px solid #e2e8f0;\">"
                + "    <div style=\"background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%); padding: 32px 24px; text-align: center; color: #ffffff;\">"
                + "      <h1 style=\"margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;\">MediClin</h1>"
                + "      <p style=\"margin: 6px 0 0; font-size: 13.5px; opacity: 0.9;\">Aviso de Cancelamento de Consulta</p>"
                + "    </div>"
                + "    <div style=\"padding: 28px 24px;\">"
                + "      <h2 style=\"margin: 0 0 12px; font-size: 18px; color: #0f172a;\">Consulta Cancelada</h2>"
                + "      <p style=\"margin: 0 0 20px; font-size: 14px; color: #64748b; line-height: 1.5;\">Informamos que a consulta agendada para <strong>" + paciente + "</strong> foi cancelada no sistema.</p>"
                + "      <div style=\"background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; padding: 18px; margin-bottom: 22px;\">"
                + "        <table style=\"width: 100%; border-collapse: collapse; font-size: 13.5px;\">"
                + "          <tr><td style=\"padding: 6px 0; color: #64748b;\">Profissional:</td><td style=\"padding: 6px 0; font-weight: 600; color: #0f172a; text-align: right;\">" + medico + "</td></tr>"
                + "          <tr><td style=\"padding: 6px 0; color: #64748b;\">Data e Horário:</td><td style=\"padding: 6px 0; font-weight: 600; color: #0f172a; text-align: right;\">" + dataHora + "</td></tr>"
                + "          <tr><td style=\"padding: 6px 0; color: #64748b;\">Motivo Informado:</td><td style=\"padding: 6px 0; font-weight: 700; color: #b91c1c; text-align: right;\">" + motivo + "</td></tr>"
                + "        </table>"
                + "      </div>"
                + "      <p style=\"margin: 0; font-size: 13px; color: #64748b; line-height: 1.5;\">Para reagendar sua consulta em uma nova data ou horário, acesse o aplicativo MediClin ou contate a recepção.</p>"
                + "    </div>"
                + "    <div style=\"border-top: 1px solid #e2e8f0; padding: 18px 24px; text-align: center; background-color: #fafbfc; font-size: 11.5px; color: #94a3b8;\">"
                + "      <p style=\"margin: 0;\">Este é um e-mail automático gerado pelo sistema MediClin. Por favor, não responda.</p>"
                + "    </div>"
                + "  </div>"
                + "</body>"
                + "</html>";
    }

}
