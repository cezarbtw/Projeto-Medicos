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
class ValidadorPacienteSemOutraConsultaNoDiaTest {

    @InjectMocks
    private ValidadorPacienteSemOutraConsultaNoDia validador;

    @Mock
    private ConsultaRepository repository;

    @Test
    @DisplayName("Deveria lancar excecao quando paciente ja possuir outra consulta no mesmo dia")
    void validarCenario1() {
        var data = LocalDateTime.now().plusDays(2).withHour(10).withMinute(0);
        var dados = new DadosAgendamentoConsulta(1L, 2L, data, null);
        var primeiroHorario = data.withHour(7);
        var ultimoHorario = data.withHour(18);

        given(repository.existsByPacienteIdAndDataBetween(2L, primeiroHorario, ultimoHorario)).willReturn(true);

        var exception = assertThrows(ValidacaoException.class, () -> validador.validar(dados));
        assertEquals("Paciente já possui uma consulta agendada nesse dia", exception.getMessage());
    }

    @Test
    @DisplayName("Nao deveria lancar excecao quando paciente nao possuir outra consulta no mesmo dia")
    void validarCenario2() {
        var data = LocalDateTime.now().plusDays(2).withHour(10).withMinute(0);
        var dados = new DadosAgendamentoConsulta(1L, 2L, data, null);
        var primeiroHorario = data.withHour(7);
        var ultimoHorario = data.withHour(18);

        given(repository.existsByPacienteIdAndDataBetween(2L, primeiroHorario, ultimoHorario)).willReturn(false);

        assertDoesNotThrow(() -> validador.validar(dados));
    }
}
