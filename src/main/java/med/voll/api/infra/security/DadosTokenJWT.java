package med.voll.api.infra.security;

import med.voll.api.domain.usuario.PerfilUsuario;

public record DadosTokenJWT(String token, String login, PerfilUsuario perfil) {
    public DadosTokenJWT(String token) {
        this(token, null, null);
    }
}
