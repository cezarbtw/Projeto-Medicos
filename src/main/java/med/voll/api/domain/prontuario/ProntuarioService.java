package med.voll.api.domain.prontuario;

import med.voll.api.domain.ValidacaoException;
import med.voll.api.domain.consulta.Consulta;
import med.voll.api.domain.consulta.ConsultaRepository;
import med.voll.api.domain.medico.MedicoRepository;
import med.voll.api.domain.paciente.PacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProntuarioService {

    @Autowired
    private ProntuarioRepository prontuarioRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private MedicoRepository medicoRepository;

    @Autowired
    private ConsultaRepository consultaRepository;

    @Transactional
    public DadosDetalhamentoProntuario registrar(DadosRegistroProntuario dados) {
        var paciente = pacienteRepository.findById(dados.idPaciente())
                .orElseThrow(() -> new ValidacaoException("Id do paciente informado não existe!"));

        if (Boolean.FALSE.equals(paciente.getAtivo())) {
            throw new ValidacaoException("Não é possível registrar prontuário para paciente inativo!");
        }

        var medico = medicoRepository.findById(dados.idMedico())
                .orElseThrow(() -> new ValidacaoException("Id do médico informado não existe!"));

        if (Boolean.FALSE.equals(medico.getAtivo())) {
            throw new ValidacaoException("Não é possível registrar prontuário com médico inativo!");
        }

        Consulta consulta = null;
        if (dados.idConsulta() != null) {
            consulta = consultaRepository.findById(dados.idConsulta())
                    .orElseThrow(() -> new ValidacaoException("Consulta informada não existe!"));
        }

        var prontuario = new Prontuario(paciente, medico, consulta, dados);
        prontuarioRepository.save(prontuario);

        return new DadosDetalhamentoProntuario(prontuario);
    }

    public Page<DadosDetalhamentoProntuario> listarPorPaciente(Long pacienteId, Pageable pageable) {
        if (!pacienteRepository.existsById(pacienteId)) {
            throw new ValidacaoException("Paciente não encontrado!");
        }
        return prontuarioRepository.findByPacienteIdOrderByDataRegistroDesc(pacienteId, pageable)
                .map(DadosDetalhamentoProntuario::new);
    }

    public DadosDetalhamentoProntuario detalhar(Long id) {
        var prontuario = prontuarioRepository.findById(id)
                .orElseThrow(() -> new ValidacaoException("Prontuário não encontrado com o id informado!"));
        return new DadosDetalhamentoProntuario(prontuario);
    }

    public DadosDetalhamentoProntuario buscarPorConsulta(Long consultaId) {
        var prontuario = prontuarioRepository.findByConsultaId(consultaId)
                .orElseThrow(() -> new ValidacaoException("Nenhum prontuário registrado para esta consulta!"));
        return new DadosDetalhamentoProntuario(prontuario);
    }
}

