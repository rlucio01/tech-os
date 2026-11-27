import pc from 'picocolors';

export function runGuide(): void {
  console.log(pc.bold(pc.cyan('\n📘 Tech OS — Guia Completo da Metodologia\n')));

  console.log(pc.bold('1. O Problema que o Tech OS Resolve'));
  console.log('   • Vibe coding funciona para protótipos, mas gera código difícil de manter.');
  console.log('   • Modelos perdem eficiência quando o contexto passa de ~50% (dumb zone).');
  console.log('   • Sem spec, não há rastreabilidade nem segurança arquitetural.\n');

  console.log(pc.bold('2. Princípios & Regra de Ouro'));
  console.log('   • IA sugere; engenheiro decide.');
  console.log('   • Código mínimo que resolve o problema (sem overengineering).');
  console.log('   • Mudanças cirúrgicas: altere apenas o necessário para a tarefa.');
  console.log(`   • ${pc.yellow('Regra de Ouro: "Consigo explicar esta mudança sem abrir o chat?"')}\n`);

  console.log(pc.bold('3. Os 4 Tipos de Incógnitas (mapeados no tos-discovery)'));
  console.log('   • Known Knowns:     o que você já sabe e colocou no pedido.');
  console.log('   • Known Unknowns:   lacunas que você sabe que precisa descobrir.');
  console.log('   • Unknown Knowns:   regras óbvias do dia a dia que você esquece de dizer.');
  console.log(`   • ${pc.red('Unknown Unknowns:')} cenários de borda que nem você sabia que existiam.\n`);

  console.log(pc.bold('4. O Fluxo das 6 Skills (Spec-Driven Development)'));
  console.log(`   0. ${pc.cyan('tos-manifesto')}  → Cria a "lei" do projeto (00-manifesto.md + _dominio.md)`);
  console.log(`   1. ${pc.cyan('tos-discovery')}  → Entrevista para alinhar problema e incógnitas (01-discovery.md)`);
  console.log(`   2. ${pc.cyan('tos-blueprint')}  → PRD técnico + impacto local/estrutural (02-blueprint.md)`);
  console.log(`   3. ${pc.cyan('tos-contratos')}  → Contratos de API/schema/segurança (03-contratos.md, opc.)`);
  console.log(`   4. ${pc.cyan('tos-planejar')}   → Fatias executáveis [AUTO] e [HUMANO] (04-plano.md)`);
  console.log(`   *  ${pc.cyan('tos-sync')}       → Atualiza a spec ANTES do código se algo mudar\n`);

  console.log(pc.bold('5. Comandos da CLI'));
  console.log(`   ${pc.green('tech-os init')}              Instala skills, regras e manifesto no projeto`);
  console.log(`   ${pc.green('tech-os status')}            Mostra progresso das features e próxima fatia`);
  console.log(`   ${pc.green('tech-os run <feature>')}     Executa fatias [AUTO] em contexto limpo + commit`);
  console.log(`   ${pc.green('tech-os guide')}             Exibe este guia no terminal\n`);
}
