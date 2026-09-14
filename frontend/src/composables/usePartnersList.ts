import { onMounted, ref } from 'vue'

import { listarParceiros } from '@/services/partnersService'
import type { ParceiroLinhaTabela, ParceiroListagem } from '@/types/partner'
import { formatarCnpj } from '@/utils/format'

function paraLinhaTabela(item: ParceiroListagem): ParceiroLinhaTabela {
  const uf = item.municipio?.uf?.sigla
  const cidade = item.municipio?.nome
  const localidade =
    cidade && uf ? `${cidade} / ${uf}` : cidade ?? uf ?? '—'

  return {
    id: item.id,
    razao_social: item.razao_social,
    nome_fantasia: item.nome_fantasia,
    cnpj: formatarCnpj(item.cnpj),
    localidade,
    limite_credito: item.limite_credito,
    ativo: item.ativo,
  }
}

export function usePartnersList() {
  const linhas = ref<ParceiroLinhaTabela[]>([])
  const carregando = ref(false)
  const erro = ref('')

  async function recarregar() {
    carregando.value = true
    erro.value = ''

    try {
      const lista = await listarParceiros()
      linhas.value = lista.map(paraLinhaTabela)
    } catch (e) {
      linhas.value = []
      erro.value = e instanceof Error ? e.message : 'Erro ao carregar parceiros.'
    } finally {
      carregando.value = false
    }
  }

  onMounted(() => {
    void recarregar()
  })

  return {
    linhas,
    carregando,
    erro,
    recarregar,
  }
}
