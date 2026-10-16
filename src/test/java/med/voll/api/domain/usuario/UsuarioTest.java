package med.voll.api.domain.usuario;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class UsuarioTest {

    @Test
    @DisplayName("Deveria gerar token de recuperacao com validade de 30 minutos")
    void gerarTokenRecuperacao() {
        var usuario = new Usuario("ana@voll.med", "123456", PerfilUsuario.RECEPCIONISTA);

        var token = usuario.gerarTokenRecuperacao();

        assertNotNull(token);
        assertNotNull(usuario.getExpiracaoTokenRecuperacao());
        assertTrue(usuario.isTokenRecuperacaoValido(token));
    }

    @Test
    @DisplayName("Deveria invalidar token se estiver expirado ou incorreto")
    void tokenInvalidoOuExpirado() {
        var usuario = new Usuario("ana@voll.med", "123456", PerfilUsuario.MEDICO);
        var token = usuario.gerarTokenRecuperacao();

        assertFalse(usuario.isTokenRecuperacaoValido("token-errado"));

        // Simula token expirado no passado
        ReflectionTestUtils.setField(usuario, "expiracaoTokenRecuperacao", LocalDateTime.now().minusMinutes(5));
        assertFalse(usuario.isTokenRecuperacaoValido(token));
    }

    @Test
    @DisplayName("Deveria redefinir senha e limpar dados de token")
    void redefinirSenha() {
        var usuario = new Usuario("ana@voll.med", "123456", PerfilUsuario.ADMIN);
        var token = usuario.gerarTokenRecuperacao();

        usuario.redefinirSenha("novaSenhaCriptografada");

        assertEquals("novaSenhaCriptografada", usuario.getSenha());
        assertNull(usuario.getTokenRecuperacao());
        assertNull(usuario.getExpiracaoTokenRecuperacao());
        assertFalse(usuario.isTokenRecuperacaoValido(token));
    }

    @Test
    @DisplayName("Deveria conter authorities corretas de acordo com perfil")
    void authoritiesPerfis() {
        var admin = new Usuario("admin@voll.med", "123456", PerfilUsuario.ADMIN);
        var medico = new Usuario("medico@voll.med", "123456", PerfilUsuario.MEDICO);
        var recepcao = new Usuario("recepcao@voll.med", "123456", PerfilUsuario.RECEPCIONISTA);

        assertTrue(admin.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")));
        assertTrue(medico.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_MEDICO")));
        assertTrue(recepcao.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_RECEPCIONISTA")));

        // Todos os usuários autenticados possuem também ROLE_USER
        assertTrue(admin.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_USER")));
    }
}

