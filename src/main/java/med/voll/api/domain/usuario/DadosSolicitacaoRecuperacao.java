package med.voll.api.domain.usuario;

import jakarta.validation.constraints.NotBlank;

public record DadosSolicitacaoRecuperacao(
        @NotBlank(message = "O login é obrigatório")
        String login
) {
}

