package med.voll.api.domain.consulta.validacoes.agendamento;

import med.voll.api.domain.ValidacaoException;
import med.voll.api.domain.consulta.DadosAgendamentoConsulta;
import med.voll.api.domain.medico.Especialidade;
import med.voll.api.domain.medico.MedicoRepository;
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
import static org.mockito.Mockito.verifyNoInteractions;

@ExtendWith(MockitoExtension.class)
class ValidadorMedicoAtivoTest {

    @InjectMocks
    private ValidadorMedicoAtivo validador;

    @Mock
    private MedicoRepository repository;

    @Test
    @DisplayName("Nao deveria fazer nada quando medico nao for informado")
    void validarCenario1() {
        var dados = new DadosAgendamentoConsulta(null, 10L, LocalDateTime.now().plusDays(1), Especialidade.CARDIOLOGIA);

        assertDoesNotThrow(() -> validador.validar(dados));
        verifyNoInteractions(repository);
    }

    @Test
    @DisplayName("Deveria lancar excecao quando medico estiver inativo no sistema")
    void validarCenario2() {
        var dados = new DadosAgendamentoConsulta(5L, 10L, LocalDateTime.now().plusDays(1), null);
        given(repository.findAtivoById(5L)).willReturn(false);

        var exception = assertThrows(ValidacaoException.class, () -> validador.validar(dados));
        assertEquals("Consulta não pode ser agendada com médico excluído", exception.getMessage());
    }

    @Test
    @DisplayName("Nao deveria lancar excecao quando medico estiver ativo no sistema")
    void validarCenario3() {
        var dados = new DadosAgendamentoConsulta(5L, 10L, LocalDateTime.now().plusDays(1), null);
        given(repository.findAtivoById(5L)).willReturn(true);

        assertDoesNotThrow(() -> validador.validar(dados));
    }
}
