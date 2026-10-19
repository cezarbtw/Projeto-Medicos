package med.voll.api.domain.prontuario;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record DadosRegistroProntuario(
        @NotNull(message = "O ID do paciente é obrigatório")
        Long idPaciente,

        @NotNull(message = "O ID do médico é obrigatório")
        Long idMedico,

        Long idConsulta,

        String queixaPrincipal,

        @NotBlank(message = "O diagnóstico é obrigatório")
        String diagnostico,

        String prescricao,

        String observacoes,

        BigDecimal peso,

        Integer altura,

        String pressaoArterial
) {
}

