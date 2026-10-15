package med.voll.api.infra.security;

import med.voll.api.domain.usuario.Usuario;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

class TokenServiceTest {

    private TokenService tokenService;

    @BeforeEach
    void setUp() {
        tokenService = new TokenService();
        ReflectionTestUtils.setField(tokenService, "secret", "12345678");
    }

    @Test
    @DisplayName("Deveria gerar token JWT valido para um usuario e extrair o subject com sucesso")
    void gerarTokenCenario1() {
        var usuario = new Usuario("ana.souza@voll.med", "123456");

        var token = tokenService.gerarToken(usuario);

        assertNotNull(token);
        assertEquals("ana.souza@voll.med", tokenService.getSubject(token));
    }

    @Test
    @DisplayName("Deveria lancar excecao ao tentar validar token JWT invalido ou corrompido")
    void getSubjectCenarioInvalido() {
        var tokenInvalido = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.signature";

        var exception = assertThrows(RuntimeException.class, () -> tokenService.getSubject(tokenInvalido));
        assertEquals("Token JWT inválido ou expirado!", exception.getMessage());
    }

    @Test
    @DisplayName("Deveria lancar excecao ao tentar validar token nulo ou vazio")
    void getSubjectCenarioNulo() {
        var exception = assertThrows(RuntimeException.class, () -> tokenService.getSubject(null));
        assertEquals("Token JWT inválido ou expirado!", exception.getMessage());
    }
}
