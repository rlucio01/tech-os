#!/usr/bin/env node
import { Command } from 'commander';
import { runInit } from './commands/init.js';
import { runStatus } from './commands/status.js';
import { runLoop, RunnerType } from './commands/run.js';
import { runGuide } from './commands/guide.js';

const program = new Command();

program
  .name('tech-os')
  .description('Tech OS — Spec-Driven Development, Context Engineering & Autonomous Loop')
  .version('0.1.0');

program
  .command('init')
  .description('Inicializa o Tech OS no projeto atual (skills, regras e manifesto)')
  .option('-y, --yes', 'Usa configurações padrão sem perguntas interativas')
  .option('-t, --tools <tools>', 'Lista separada por vírgula: antigravity,claude,cursor,codex')
  .option('-p, --profile <profile>', 'Perfil do manifesto: mvp | producao | estudo')
  .action(async (options) => {
    await runInit(options);
  });

program
  .command('status')
  .description('Mostra o status das features e fatias em .tech-os/')
  .action(async () => {
    await runStatus();
  });

program
  .command('run <feature> [maxIterations]')
  .description('Executa o loop autônomo em contexto limpo para uma feature (ex: 001-auth)')
  .option('-r, --runner <runner>', 'Runner CLI: claude | codex | custom', 'claude')
  .option('--cmd <command>', 'Comando customizado quando --runner custom')
  .option('--test-cmd <command>', 'Sobrescreve o comando de verificação (DoD)')
  .option('--dry-run', 'Mostra o prompt em contexto limpo sem executar o agente')
  .option('--no-commit', 'Não cria commit git automático após cada fatia')
  .action(async (feature: string, maxIterations: string | undefined, options) => {
    await runLoop(feature, maxIterations, {
      runner: options.runner as RunnerType,
      cmd: options.cmd,
      testCmd: options.testCmd,
      dryRun: Boolean(options.dryRun),
      commit: options.commit,
    });
  });

program
  .command('guide')
  .description('Exibe um resumo didático da metodologia Tech OS no terminal')
  .action(() => {
    runGuide();
  });

program.parseAsync(process.argv).catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`Erro: ${message}`);
  process.exit(1);
});
