package med.voll.api.domain.consulta.validacoes.agendamento;

import med.voll.api.domain.ValidacaoException;
import med.voll.api.domain.consulta.DadosAgendamentoConsulta;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

class ValidadorHorarioFuncionamentoClinicaTest {

    private final ValidadorHorarioFuncionamentoClinica validador = new ValidadorHorarioFuncionamentoClinica();

    @Test
    @DisplayName("Deveria lancar excecao quando consulta for agendada em um domingo")
    void validar_cenarioDomingo() {
        var proximoDomingo = LocalDate.now().with(TemporalAdjusters.next(DayOfWeek.SUNDAY)).atTime(10, 0);
        var dados = new DadosAgendamentoConsulta(1L, 1L, proximoDomingo, null);

        assertThrows(ValidacaoException.class, () -> validador.validar(dados));
    }

    @Test
    @DisplayName("Deveria lancar excecao quando consulta for antes das 7h")
    void validar_cenarioAntesDas7h() {
        var proximaSegunda = LocalDate.now().with(TemporalAdjusters.next(DayOfWeek.MONDAY)).atTime(6, 59);
        var dados = new DadosAgendamentoConsulta(1L, 1L, proximaSegunda, null);

        assertThrows(ValidacaoException.class, () -> validador.validar(dados));
    }

    @Test
    @DisplayName("Deveria lancar excecao quando consulta for depois das 18h")
    void validar_cenarioDepoisDas18h() {
        var proximaSegunda = LocalDate.now().with(TemporalAdjusters.next(DayOfWeek.MONDAY)).atTime(19, 0);
        var dados = new DadosAgendamentoConsulta(1L, 1L, proximaSegunda, null);

        assertThrows(ValidacaoException.class, () -> validador.validar(dados));
    }

    @Test
    @DisplayName("Nao deveria lancar excecao quando consulta estiver dentro do horario de funcionamento")
    void validar_cenarioValido() {
        var proximaSegunda = LocalDate.now().with(TemporalAdjusters.next(DayOfWeek.MONDAY)).atTime(10, 0);
        var dados = new DadosAgendamentoConsulta(1L, 1L, proximaSegunda, null);

        assertDoesNotThrow(() -> validador.validar(dados));
    }
}
