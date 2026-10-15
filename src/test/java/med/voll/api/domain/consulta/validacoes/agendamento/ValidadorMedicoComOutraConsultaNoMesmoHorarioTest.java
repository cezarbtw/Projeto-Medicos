package med.voll.api.domain.consulta.validacoes.agendamento;

import med.voll.api.domain.ValidacaoException;
import med.voll.api.domain.consulta.ConsultaRepository;
import med.voll.api.domain.consulta.DadosAgendamentoConsulta;
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
class ValidadorMedicoComOutraConsultaNoMesmoHorarioTest {

    @InjectMocks
    private ValidadorMedicoComOutraConsultaNoMesmoHorario validador;

    @Mock
    private ConsultaRepository repository;

    @Test
    @DisplayName("Deveria lancar excecao quando medico ja possui outra consulta no mesmo horario")
    void validarCenario1() {
        var data = LocalDateTime.now().plusDays(1).withHour(10).withMinute(0);
        var dados = new DadosAgendamentoConsulta(5L, 2L, data, null);

        given(repository.existsByMedicoIdAndDataAndMotivoCancelamentoIsNull(5L, data)).willReturn(true);

        var exception = assertThrows(ValidacaoException.class, () -> validador.validar(dados));
        assertEquals("Médico já possui outra consulta agendada nesse mesmo horário", exception.getMessage());
    }

    @Test
    @DisplayName("Nao deveria lancar excecao quando medico nao possui outra consulta no mesmo horario")
    void validarCenario2() {
        var data = LocalDateTime.now().plusDays(1).withHour(10).withMinute(0);
        var dados = new DadosAgendamentoConsulta(5L, 2L, data, null);

        given(repository.existsByMedicoIdAndDataAndMotivoCancelamentoIsNull(5L, data)).willReturn(false);

        assertDoesNotThrow(() -> validador.validar(dados));
    }
}
