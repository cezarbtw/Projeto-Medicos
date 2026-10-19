package med.voll.api.controller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import med.voll.api.domain.prontuario.DadosDetalhamentoProntuario;
import med.voll.api.domain.prontuario.DadosRegistroProntuario;
import med.voll.api.domain.prontuario.ProntuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@RequestMapping("/prontuarios")
@SecurityRequirement(name = "bearer-key")
public class ProntuarioController {

    @Autowired
    private ProntuarioService service;

    @PostMapping
    public ResponseEntity registrar(@RequestBody @Valid DadosRegistroProntuario dados, UriComponentsBuilder uriBuilder) {
        var prontuario = service.registrar(dados);
        var uri = uriBuilder.path("/prontuarios/{id}").buildAndExpand(prontuario.id()).toUri();
        return ResponseEntity.created(uri).body(prontuario);
    }

    @GetMapping("/paciente/{idPaciente}")
    public ResponseEntity<Page<DadosDetalhamentoProntuario>> listarPorPaciente(
            @PathVariable Long idPaciente,
            @PageableDefault(size = 10, sort = {"dataRegistro"}) Pageable pageable) {
        var page = service.listarPorPaciente(idPaciente, pageable);
        return ResponseEntity.ok(page);
    }

    @GetMapping("/{id}")
    public ResponseEntity detalhar(@PathVariable Long id) {
        var prontuario = service.detalhar(id);
        return ResponseEntity.ok(prontuario);
    }

    @GetMapping("/consulta/{consultaId}")
    public ResponseEntity buscarPorConsulta(@PathVariable Long consultaId) {
        var prontuario = service.buscarPorConsulta(consultaId);
        return ResponseEntity.ok(prontuario);
    }
}

