package med.voll.api.domain.consulta.validacoes.agendamento;

import med.voll.api.domain.ValidacaoException;
import med.voll.api.domain.consulta.DadosAgendamentoConsulta;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class ValidadorHorarioAntecedenciaTest {

    private final ValidadorHorarioAntecedencia validador = new ValidadorHorarioAntecedencia();

    @Test
    @DisplayName("Deveria lancar excecao quando consulta for agendada com menos de 30 minutos de antecedencia")
    void validarCenario1() {
        var dados = new DadosAgendamentoConsulta(1L, 1L, LocalDateTime.now().plusMinutes(20), null);

        var exception = assertThrows(ValidacaoException.class, () -> validador.validar(dados));
        assertEquals("Consulta deve ser agendada com antecedência mínima de 30 minutos", exception.getMessage());
    }

    @Test
    @DisplayName("Nao deveria lancar excecao quando consulta for agendada com mais de 30 minutos de antecedencia")
    void validarCenario2() {
        var dados = new DadosAgendamentoConsulta(1L, 1L, LocalDateTime.now().plusMinutes(45), null);

        assertDoesNotThrow(() -> validador.validar(dados));
    }
}
