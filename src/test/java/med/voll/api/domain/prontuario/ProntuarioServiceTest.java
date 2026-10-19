package med.voll.api.domain.prontuario;

import med.voll.api.domain.ValidacaoException;
import med.voll.api.domain.consulta.Consulta;
import med.voll.api.domain.consulta.ConsultaRepository;
import med.voll.api.domain.medico.Especialidade;
import med.voll.api.domain.medico.Medico;
import med.voll.api.domain.medico.MedicoRepository;
import med.voll.api.domain.paciente.Paciente;
import med.voll.api.domain.paciente.PacienteRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProntuarioServiceTest {

    @InjectMocks
    private ProntuarioService service;

    @Mock
    private ProntuarioRepository prontuarioRepository;

    @Mock
    private PacienteRepository pacienteRepository;

    @Mock
    private MedicoRepository medicoRepository;

    @Mock
    private ConsultaRepository consultaRepository;

    @Test
    @DisplayName("Deveria registrar prontuario com sucesso quando dados sao validos")
    void registrar_cenarioSucesso() {
        var paciente = new Paciente();
        ReflectionTestUtils.setField(paciente, "id", 1L);
        ReflectionTestUtils.setField(paciente, "nome", "Carlos Silva");
        ReflectionTestUtils.setField(paciente, "ativo", true);

        var medico = new Medico();
        ReflectionTestUtils.setField(medico, "id", 2L);
        ReflectionTestUtils.setField(medico, "nome", "Dra. Juliana");
        ReflectionTestUtils.setField(medico, "crm", "123456");
        ReflectionTestUtils.setField(medico, "especialidade", Especialidade.CARDIOLOGIA);
        ReflectionTestUtils.setField(medico, "ativo", true);

        when(pacienteRepository.findById(1L)).thenReturn(Optional.of(paciente));
        when(medicoRepository.findById(2L)).thenReturn(Optional.of(medico));

        var dados = new DadosRegistroProntuario(
                1L,
                2L,
                null,
                "Dor no peito e falta de ar ao esforco",
                "Hipertensao Estagio 1",
                "Losartana 50mg 1x ao dia",
                "Retorno em 30 dias com mapa de pressao",
                new BigDecimal("78.50"),
                175,
                "140/90"
        );

        var detalhamento = service.registrar(dados);

        assertNotNull(detalhamento);
        assertEquals("Carlos Silva", detalhamento.nomePaciente());
        assertEquals("Dra. Juliana", detalhamento.nomeMedico());
        assertEquals("Hipertensao Estagio 1", detalhamento.diagnostico());
        assertEquals("140/90", detalhamento.pressaoArterial());
        verify(prontuarioRepository).save(any(Prontuario.class));
    }

    @Test
    @DisplayName("Deveria lancar excecao ao tentar registrar prontuario para paciente inexistente")
    void registrar_pacienteInexistente() {
        when(pacienteRepository.findById(99L)).thenReturn(Optional.empty());

        var dados = new DadosRegistroProntuario(
                99L, 1L, null, "Queixa", "Diagnostico", null, null, null, null, null
        );

        var ex = assertThrows(ValidacaoException.class, () -> service.registrar(dados));
        assertEquals("Id do paciente informado não existe!", ex.getMessage());
    }

    @Test
    @DisplayName("Deveria lancar excecao ao tentar registrar prontuario para paciente inativo")
    void registrar_pacienteInativo() {
        var paciente = new Paciente();
        ReflectionTestUtils.setField(paciente, "id", 1L);
        ReflectionTestUtils.setField(paciente, "ativo", false);

        when(pacienteRepository.findById(1L)).thenReturn(Optional.of(paciente));

        var dados = new DadosRegistroProntuario(
                1L, 1L, null, "Queixa", "Diagnostico", null, null, null, null, null
        );

        var ex = assertThrows(ValidacaoException.class, () -> service.registrar(dados));
        assertEquals("Não é possível registrar prontuário para paciente inativo!", ex.getMessage());
    }

    @Test
    @DisplayName("Deveria lancar excecao ao tentar registrar prontuario para medico inativo")
    void registrar_medicoInativo() {
        var paciente = new Paciente();
        ReflectionTestUtils.setField(paciente, "id", 1L);
        ReflectionTestUtils.setField(paciente, "ativo", true);

        var medico = new Medico();
        ReflectionTestUtils.setField(medico, "id", 2L);
        ReflectionTestUtils.setField(medico, "ativo", false);

        when(pacienteRepository.findById(1L)).thenReturn(Optional.of(paciente));
        when(medicoRepository.findById(2L)).thenReturn(Optional.of(medico));

        var dados = new DadosRegistroProntuario(
                1L, 2L, null, "Queixa", "Diagnostico", null, null, null, null, null
        );

        var ex = assertThrows(ValidacaoException.class, () -> service.registrar(dados));
        assertEquals("Não é possível registrar prontuário com médico inativo!", ex.getMessage());
    }

    @Test
    @DisplayName("Deveria listar prontuarios por paciente com sucesso")
    void listarPorPaciente_sucesso() {
        when(pacienteRepository.existsById(1L)).thenReturn(true);

        var paciente = new Paciente();
        ReflectionTestUtils.setField(paciente, "id", 1L);
        ReflectionTestUtils.setField(paciente, "nome", "Paciente Teste");

        var medico = new Medico();
        ReflectionTestUtils.setField(medico, "id", 2L);
        ReflectionTestUtils.setField(medico, "nome", "Dr. Teste");
        ReflectionTestUtils.setField(medico, "crm", "654321");
        ReflectionTestUtils.setField(medico, "especialidade", Especialidade.DERMATOLOGIA);

        var prontuario = new Prontuario(
                paciente,
                medico,
                null,
                new DadosRegistroProntuario(1L, 2L, null, "Mancha", "Dermatite", null, null, null, null, null)
        );

        var pageable = PageRequest.of(0, 10);
        when(prontuarioRepository.findByPacienteIdOrderByDataRegistroDesc(1L, pageable))
                .thenReturn(new PageImpl<>(List.of(prontuario)));

        var resultado = service.listarPorPaciente(1L, pageable);

        assertNotNull(resultado);
        assertEquals(1, resultado.getContent().size());
        assertEquals("Dermatite", resultado.getContent().get(0).diagnostico());
    }
}

