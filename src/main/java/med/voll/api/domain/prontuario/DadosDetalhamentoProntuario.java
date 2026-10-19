package med.voll.api.domain.prontuario;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record DadosDetalhamentoProntuario(
        Long id,
        Long idPaciente,
        String nomePaciente,
        Long idMedico,
        String nomeMedico,
        String crmMedico,
        String especialidadeMedico,
        Long idConsulta,
        LocalDateTime dataRegistro,
        String queixaPrincipal,
        String diagnostico,
        String prescricao,
        String observacoes,
        BigDecimal peso,
        Integer altura,
        String pressaoArterial
) {
    public DadosDetalhamentoProntuario(Prontuario prontuario) {
        this(
                prontuario.getId(),
                prontuario.getPaciente().getId(),
                prontuario.getPaciente().getNome(),
                prontuario.getMedico().getId(),
                prontuario.getMedico().getNome(),
                prontuario.getMedico().getCrm(),
                prontuario.getMedico().getEspecialidade() != null ? prontuario.getMedico().getEspecialidade().toString() : null,
                prontuario.getConsulta() != null ? prontuario.getConsulta().getId() : null,
                prontuario.getDataRegistro(),
                prontuario.getQueixaPrincipal(),
                prontuario.getDiagnostico(),
                prontuario.getPrescricao(),
                prontuario.getObservacoes(),
                prontuario.getPeso(),
                prontuario.getAltura(),
                prontuario.getPressaoArterial()
        );
    }
}

