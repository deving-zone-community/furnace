'use client'
import { useState, useEffect, useMemo } from 'react'
import type { AsyncHook } from '@/types'
import { ENDPOINTS, chainIds } from '@/constants'
import { FurnaceClient, FurnaceQueryClient } from '@/codegen'
import { useRecoilStateLoadable } from 'recoil'
import { clientsAtom } from '@/state'
import { useCosmWasmClient, useCosmWasmSigningClient } from 'graz'
import { chainIdConvert, useChainContext } from '@/hooks'

type UseSigningClientResult = AsyncHook<FurnaceClient | null>

type UseClientResult = AsyncHook<FurnaceQueryClient | null>

/**
 * Fetches all the furnace clients for each of the chains in the ENDPOINTS object
 * and stores them in the clients atom/recoil
 */
export const useAllCosmWasmClients = (): void => {
  const { data: client } = useCosmWasmClient({
    chainId: chainIds,
    multiChain: true,
  })
  const [_, setClients] = useRecoilStateLoadable(clientsAtom)

  useEffect(() => {
    const clients = Object.entries(ENDPOINTS)
      .map(
        ([chainName, { chainId }]) =>
          [chainName, client?.[chainId], chainId] as const
      )
      .filter(([_, queryClient]) => typeof queryClient !== 'undefined')
      .flatMap(
        ([chainName, queryClient]) => {
          return (queryClient != null)
            ? [[
                chainName,
                new FurnaceQueryClient(
                  queryClient,
                  ENDPOINTS[chainName].contractAddress
                ),
              ] as const]
            : []
        }
      )

    setClients(Object.fromEntries(clients))
  }, [client, setClients])
}

/**
 * Gets the Cosmwasm client for the furnace on a given chain.
 * Note: Will not return the client until the user has connected their wallet.
 * @param chainName The name of the chain for the client that you want.
 * @returns The client that can be used to interact with the furnace.
 */
export const useSigningClient = (chainName: string): UseSigningClientResult => {
  const { data: chainContext, isConnected } = useChainContext(chainName)
  const { data: signingClient } = useCosmWasmSigningClient({ chainId: chainIdConvert(chainName) })
  const [result, setResult] = useState<UseSigningClientResult>({
    result: null,
    loading: false,
    error: null,
  })
  const bech32Address = chainContext?.bech32Address

  useEffect(
    () => {
      if (!isConnected || bech32Address == null || typeof signingClient === 'undefined') return
      setResult(prev => ({ ...prev, loading: true }))
      if (signingClient !== null) {
        const furnaceClient = new FurnaceClient(signingClient, bech32Address, ENDPOINTS[chainName].contractAddress)
        setResult(prev => ({ ...prev, result: furnaceClient, error: null, loading: false }))
      }
    }, [isConnected, bech32Address, signingClient, chainName]
  )

  return useMemo(() => result, [result])
}
