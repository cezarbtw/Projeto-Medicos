package med.voll.api.infra.email;

import med.voll.api.domain.consulta.Consulta;

public interface EmailService {

    void enviarEmailConfirmacaoAgendamento(Consulta consulta);

    void enviarEmailCancelamento(Consulta consulta);

}
