import { type Ref, ref, watch } from 'vue'

import { listarMunicipiosPorUf, listarUfs } from '@/services/geoService'
import type { Municipio, UfOpcao } from '@/types/geo'

export function useUfMunicipio(ufId: Ref<number | null>, municipioId: Ref<number | null>) {
  const ufs = ref<UfOpcao[]>([])
  const municipios = ref<Municipio[]>([])
  const carregandoUfs = ref(false)
  const carregandoMunicipios = ref(false)
  const erroGeo = ref('')

  async function carregarUfs() {
    carregandoUfs.value = true
    erroGeo.value = ''
    try {
      ufs.value = await listarUfs()
    } catch (e) {
      ufs.value = []
      erroGeo.value = e instanceof Error ? e.message : 'Erro ao carregar UFs.'
    } finally {
      carregandoUfs.value = false
    }
  }

  async function carregarMunicipios(uf: number) {
    carregandoMunicipios.value = true
    erroGeo.value = ''
    try {
      municipios.value = await listarMunicipiosPorUf(uf)
    } catch (e) {
      municipios.value = []
      erroGeo.value = e instanceof Error ? e.message : 'Erro ao carregar municípios.'
    } finally {
      carregandoMunicipios.value = false
    }
  }

  watch(
    ufId,
    async (novoUf, ufAnterior) => {
      if (!novoUf) {
        municipios.value = []
        municipioId.value = null
        return
      }

      if (ufAnterior !== undefined && novoUf !== ufAnterior) {
        municipioId.value = null
      }

      await carregarMunicipios(novoUf)

      if (
        municipioId.value &&
        !municipios.value.some((m) => m.id === municipioId.value)
      ) {
        municipioId.value = null
      }
    },
    { immediate: true },
  )

  return {
    ufs,
    municipios,
    carregandoUfs,
    carregandoMunicipios,
    erroGeo,
    carregarUfs,
  }
}
