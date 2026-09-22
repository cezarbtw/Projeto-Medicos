package med.voll.api.controller;

import med.voll.api.domain.usuario.DadosAutenticacao;
import med.voll.api.domain.usuario.DadosCadastroUsuario;
import med.voll.api.domain.usuario.Usuario;
import med.voll.api.domain.usuario.UsuarioRepository;
import med.voll.api.infra.security.TokenService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.json.AutoConfigureJsonTesters;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.json.JacksonTester;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

@SpringBootTest
@AutoConfigureMockMvc
@AutoConfigureJsonTesters
@ActiveProfiles("test")
class AutenticacaoControllerTest {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private JacksonTester<DadosCadastroUsuario> dadosCadastroUsuarioJson;

    @Autowired
    private JacksonTester<DadosAutenticacao> dadosAutenticacaoJson;

    @MockBean
    private UsuarioRepository usuarioRepository;

    @MockBean
    private AuthenticationManager authenticationManager;

    @MockBean
    private TokenService tokenService;

    @MockBean
    private PasswordEncoder passwordEncoder;

    @Test
    @DisplayName("Deveria devolver codigo 400 ao cadastrar usuario com dados invalidos")
    void cadastrar_cenario1() throws Exception {
        var response = mvc.perform(post("/cadastro")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andReturn().getResponse();

        assertThat(response.getStatus()).isEqualTo(HttpStatus.BAD_REQUEST.value());
    }

    @Test
    @DisplayName("Deveria devolver codigo 400 ao cadastrar com login ja existente")
    void cadastrar_cenario2() throws Exception {
        when(usuarioRepository.findByLogin("admin@voll.med")).thenReturn(new Usuario("admin@voll.med", "123456"));

        var response = mvc.perform(post("/cadastro")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(dadosCadastroUsuarioJson.write(
                                new DadosCadastroUsuario("admin@voll.med", "123456")
                        ).getJson()))
                .andReturn().getResponse();

        assertThat(response.getStatus()).isEqualTo(HttpStatus.BAD_REQUEST.value());
        assertThat(response.getContentAsString(java.nio.charset.StandardCharsets.UTF_8)).contains("Login já cadastrado");
    }

    @Test
    @DisplayName("Deveria devolver codigo 201 e token JWT ao cadastrar usuario com sucesso")
    void cadastrar_cenario3() throws Exception {
        when(usuarioRepository.findByLogin("novo@voll.med")).thenReturn(null);
        when(passwordEncoder.encode("123456")).thenReturn("$2a$10$encodedPassword");
        when(tokenService.gerarToken(any(Usuario.class))).thenReturn("token-jwt-mock");

        var response = mvc.perform(post("/cadastro")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(dadosCadastroUsuarioJson.write(
                                new DadosCadastroUsuario("novo@voll.med", "123456")
                        ).getJson()))
                .andReturn().getResponse();

        assertThat(response.getStatus()).isEqualTo(HttpStatus.CREATED.value());
        assertThat(response.getContentAsString()).contains("token-jwt-mock");
    }

    @Test
    @DisplayName("Deveria autenticar com sucesso e devolver token JWT")
    void login_cenario1() throws Exception {
        var usuario = new Usuario("admin@voll.med", "123456");
        var authToken = new UsernamePasswordAuthenticationToken(usuario, null, usuario.getAuthorities());
        when(authenticationManager.authenticate(any())).thenReturn(authToken);
        when(tokenService.gerarToken(any())).thenReturn("token-login-mock");

        var response = mvc.perform(post("/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(dadosAutenticacaoJson.write(
                                new DadosAutenticacao("admin@voll.med", "123456")
                        ).getJson()))
                .andReturn().getResponse();

        assertThat(response.getStatus()).isEqualTo(HttpStatus.OK.value());
        assertThat(response.getContentAsString()).contains("token-login-mock");
    }
}
