package med.voll.api.infra.email;

import jakarta.mail.Session;
import jakarta.mail.internet.MimeMessage;
import med.voll.api.domain.consulta.Consulta;
import med.voll.api.domain.consulta.MotivoCancelamento;
import med.voll.api.domain.endereco.DadosEndereco;
import med.voll.api.domain.endereco.Endereco;
import med.voll.api.domain.medico.DadosCadastroMedico;
import med.voll.api.domain.medico.Especialidade;
import med.voll.api.domain.medico.Medico;
import med.voll.api.domain.paciente.DadosCadastroPaciente;
import med.voll.api.domain.paciente.Paciente;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.Properties;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EnviadorDeEmailServiceTest {

    @Mock
    private JavaMailSender mailSender;

    @InjectMocks
    private EnviadorDeEmailService emailService;

    private Consulta consulta;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(emailService, "remetente", "nao-responder@mediclin.med.br");
        ReflectionTestUtils.setField(emailService, "habilitado", true);

        var endereco = new DadosEndereco("Rua 1", "Bairro", "00000000", "Brasília", "DF", null, null);
        var dadosMedico = new DadosCadastroMedico("Dr. Carlos", "carlos@mediclin.med.br", "61999999999", "123456", Especialidade.CARDIOLOGIA, endereco);
        var medico = new Medico(dadosMedico);

        var dadosPaciente = new DadosCadastroPaciente("Maria Silva", "maria@email.com", "61988888888", "12345678900", endereco, null, null);
        var paciente = new Paciente(dadosPaciente);

        consulta = new Consulta(1L, medico, paciente, LocalDateTime.now().plusDays(2), null);
    }

    @Test
    @DisplayName("Deveria enviar e-mail de confirmacao de agendamento para paciente e medico")
    void enviarEmailConfirmacaoAgendamentoCenario1() {
        MimeMessage mimeMessage = new MimeMessage(Session.getInstance(new Properties()));
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        emailService.enviarEmailConfirmacaoAgendamento(consulta);

        // Deve disparar para o paciente e para o médico
        verify(mailSender, times(2)).send(any(MimeMessage.class));
    }

    @Test
    @DisplayName("Deveria enviar e-mail de cancelamento com motivo informado")
    void enviarEmailCancelamentoCenario1() {
        MimeMessage mimeMessage = new MimeMessage(Session.getInstance(new Properties()));
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        consulta.cancelar(MotivoCancelamento.PACIENTE_DESISTIU);
        emailService.enviarEmailCancelamento(consulta);

        verify(mailSender, times(2)).send(any(MimeMessage.class));
    }

    @Test
    @DisplayName("Nao deveria disparar e-mail quando desabilitado por configuracao")
    void naoDeveriaDispararQuandoDesabilitado() {
        ReflectionTestUtils.setField(emailService, "habilitado", false);

        emailService.enviarEmailConfirmacaoAgendamento(consulta);
        emailService.enviarEmailCancelamento(consulta);

        verify(mailSender, never()).send(any(MimeMessage.class));
    }

    @Test
    @DisplayName("Deveria capturar falha de envio sem propagar excecao para o fluxo da consulta")
    void deveriaCapturarFalhaDeEnvioSemLancarExcecao() {
        MimeMessage mimeMessage = new MimeMessage(Session.getInstance(new Properties()));
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        doThrow(new MailSendException("SMTP timeout")).when(mailSender).send(any(MimeMessage.class));

        assertDoesNotThrow(() -> emailService.enviarEmailConfirmacaoAgendamento(consulta));
    }

}
