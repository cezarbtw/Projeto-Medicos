package med.voll.api.controller;

import med.voll.api.domain.prontuario.DadosDetalhamentoProntuario;
import med.voll.api.domain.prontuario.DadosRegistroProntuario;
import med.voll.api.domain.prontuario.ProntuarioService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.json.AutoConfigureJsonTesters;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.json.JacksonTester;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

@SpringBootTest
@AutoConfigureMockMvc
@AutoConfigureJsonTesters
@ActiveProfiles("test")
class ProntuarioControllerTest {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private JacksonTester<DadosRegistroProntuario> dadosRegistroProntuarioJson;

    @Autowired
    private JacksonTester<DadosDetalhamentoProntuario> dadosDetalhamentoProntuarioJson;

    @MockBean
    private ProntuarioService service;

    @Test
    @DisplayName("Deveria devolver codigo http 400 quando informacoes estao invalidas")
    @WithMockUser
    void registrar_cenarioInvalido() throws Exception {
        var response = mvc.perform(post("/prontuarios")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andReturn().getResponse();

        assertThat(response.getStatus()).isEqualTo(HttpStatus.BAD_REQUEST.value());
    }

    @Test
    @DisplayName("Deveria devolver codigo http 201 quando informacoes estao validas")
    @WithMockUser
    void registrar_cenarioValido() throws Exception {
        var dadosRegistro = new DadosRegistroProntuario(
                1L,
                2L,
                3L,
                "Febre alta persistente",
                "Gripe Viral",
                "Paracetamol 500mg 6/6h",
                "Repouso e hidratacao",
                new BigDecimal("65.00"),
                170,
                "120/80"
        );

        var dadosDetalhamento = new DadosDetalhamentoProntuario(
                10L,
                1L,
                "Paciente Teste",
                2L,
                "Dr. Teste",
                "123456",
                "CLINICA_MEDICA",
                3L,
                LocalDateTime.now(),
                dadosRegistro.queixaPrincipal(),
                dadosRegistro.diagnostico(),
                dadosRegistro.prescricao(),
                dadosRegistro.observacoes(),
                dadosRegistro.peso(),
                dadosRegistro.altura(),
                dadosRegistro.pressaoArterial()
        );

        when(service.registrar(any())).thenReturn(dadosDetalhamento);

        var response = mvc.perform(post("/prontuarios")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(dadosRegistroProntuarioJson.write(dadosRegistro).getJson()))
                .andReturn().getResponse();

        assertThat(response.getStatus()).isEqualTo(HttpStatus.CREATED.value());
        assertThat(response.getContentAsString()).contains("Gripe Viral");
        assertThat(response.getContentAsString()).contains("Paciente Teste");
    }

    @Test
    @DisplayName("Deveria listar prontuarios por paciente com status 200")
    @WithMockUser
    void listarPorPaciente() throws Exception {
        var dadosDetalhamento = new DadosDetalhamentoProntuario(
                10L,
                1L,
                "Paciente Teste",
                2L,
                "Dr. Teste",
                "123456",
                "CLINICA_MEDICA",
                null,
                LocalDateTime.now(),
                "Queixa",
                "Enxaqueca",
                "Dipirona",
                "Evitar cafeina",
                null,
                null,
                "120/80"
        );

        when(service.listarPorPaciente(eq(1L), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(dadosDetalhamento)));

        var response = mvc.perform(get("/prontuarios/paciente/1"))
                .andReturn().getResponse();

        assertThat(response.getStatus()).isEqualTo(HttpStatus.OK.value());
        assertThat(response.getContentAsString()).contains("Enxaqueca");
    }

    @Test
    @DisplayName("Deveria buscar prontuario por id com status 200")
    @WithMockUser
    void detalhar() throws Exception {
        var dadosDetalhamento = new DadosDetalhamentoProntuario(
                10L,
                1L,
                "Paciente Teste",
                2L,
                "Dr. Teste",
                "123456",
                "CLINICA_MEDICA",
                null,
                LocalDateTime.now(),
                "Queixa",
                "Enxaqueca",
                "Dipirona",
                "Evitar cafeina",
                null,
                null,
                "120/80"
        );

        when(service.detalhar(10L)).thenReturn(dadosDetalhamento);

        var response = mvc.perform(get("/prontuarios/10"))
                .andReturn().getResponse();

        assertThat(response.getStatus()).isEqualTo(HttpStatus.OK.value());
        assertThat(response.getContentAsString()).contains("Enxaqueca");
    }
}

