package med.voll.api.domain.consulta.validacoes.cancelamento;

import med.voll.api.domain.ValidacaoException;
import med.voll.api.domain.consulta.Consulta;
import med.voll.api.domain.consulta.ConsultaRepository;
import med.voll.api.domain.consulta.DadosCancelamentoConsulta;
import med.voll.api.domain.consulta.MotivoCancelamento;
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
import static org.mockito.Mockito.mock;

@ExtendWith(MockitoExtension.class)
class ValidadorHorarioAntecedenciaCancelamentoTest {

    @InjectMocks
    private ValidadorHorarioAntecedencia validador;

    @Mock
    private ConsultaRepository repository;

    @Test
    @DisplayName("Deveria lancar excecao quando cancelamento for solicitado com menos de 24 horas de antecedencia")
    void validarCenario1() {
        var dados = new DadosCancelamentoConsulta(1L, MotivoCancelamento.PACIENTE_DESISTIU);
        var consulta = mock(Consulta.class);
        given(consulta.getData()).willReturn(LocalDateTime.now().plusHours(20));
        given(repository.getReferenceById(1L)).willReturn(consulta);

        var exception = assertThrows(ValidacaoException.class, () -> validador.validar(dados));
        assertEquals("Consulta somente pode ser cancelada com antecedência mínima de 24h!", exception.getMessage());
    }

    @Test
    @DisplayName("Nao deveria lancar excecao quando cancelamento for solicitado com mais de 24 horas de antecedencia")
    void validarCenario2() {
        var dados = new DadosCancelamentoConsulta(1L, MotivoCancelamento.PACIENTE_DESISTIU);
        var consulta = mock(Consulta.class);
        given(consulta.getData()).willReturn(LocalDateTime.now().plusHours(30));
        given(repository.getReferenceById(1L)).willReturn(consulta);

        assertDoesNotThrow(() -> validador.validar(dados));
    }
}
