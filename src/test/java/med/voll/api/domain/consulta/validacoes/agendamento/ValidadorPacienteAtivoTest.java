package med.voll.api.domain.consulta.validacoes.agendamento;

import med.voll.api.domain.ValidacaoException;
import med.voll.api.domain.consulta.DadosAgendamentoConsulta;
import med.voll.api.domain.paciente.PacienteRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class ValidadorPacienteAtivoTest {

    @InjectMocks
    private ValidadorPacienteAtivo validador;

    @Mock
    private PacienteRepository repository;

    @Test
    @DisplayName("Deveria lancar excecao quando paciente estiver inativo no sistema")
    void validarCenario1() {
        var dados = new DadosAgendamentoConsulta(1L, 10L, LocalDateTime.now().plusDays(1), null);
        given(repository.findAtivoById(10L)).willReturn(false);

        var exception = assertThrows(ValidacaoException.class, () -> validador.validar(dados));
        assertEquals("Consulta não pode ser agendada com paciente excluído", exception.getMessage());
    }

    @Test
    @DisplayName("Nao deveria lancar excecao quando paciente estiver ativo no sistema")
    void validarCenario2() {
        var dados = new DadosAgendamentoConsulta(1L, 10L, LocalDateTime.now().plusDays(1), null);
        given(repository.findAtivoById(10L)).willReturn(true);

        assertDoesNotThrow(() -> validador.validar(dados));
    }
}
