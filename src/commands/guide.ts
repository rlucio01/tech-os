import pc from 'picocolors';

export function runGuide(): void {
  console.log(pc.bold(pc.cyan('\n📘 Tech OS — Guia Rápido da Metodologia\n')));

  console.log(pc.bold('Por que Tech OS?'));
  console.log('  Vibe coding funciona para protótipos, mas gera código que ninguém entende.');
  console.log('  Além disso, modelos perdem qualidade quando o contexto passa de ~50% (dumb zone).');
  console.log('  O Tech OS resolve isso com Spec-Driven Development + Contexto Limpo.\n');

  console.log(pc.bold('Regra de Ouro:'));
  console.log(pc.yellow('  "Consigo explicar esta mudança sem abrir o chat?"'));
  console.log('  Se não conseguir, não faça commit.\n');

  console.log(pc.bold('O Fluxo em 6 Passos:'));
  console.log(`  0. ${pc.cyan('tos-manifesto')}   → Cria a "lei" do projeto (.tech-os/00-manifesto.md)`);
  console.log(`  1. ${pc.cyan('tos-discovery')}   → Entrevista para revelar incógnitas (01-discovery.md)`);
  console.log(`  2. ${pc.cyan('tos-blueprint')}   → PRD técnico + impacto local/estrutural (02-blueprint.md)`);
  console.log(`  3. ${pc.cyan('tos-contratos')}   → Contratos de API/schema/segurança (03-contratos.md, opc.)`);
  console.log(`  4. ${pc.cyan('tos-planejar')}    → Quebra em fatias [AUTO] e [HUMANO] (04-plano.md)`);
  console.log(`  5. ${pc.cyan('tech-os run')}     → Executa fatia por fatia em contexto limpo + commit`);
  console.log(`  *  ${pc.cyan('tos-sync')}        → Atualiza a spec ANTES do código se algo mudar\n`);
}
