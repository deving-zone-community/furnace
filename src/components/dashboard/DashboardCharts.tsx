'use client'
import type { TotalFurnaceData } from '@/hooks'
import {
  Unstable_Grid2 as Grid,
  Paper
} from '@mui/material'
import React, { type FC } from 'react'
import { NumberOfFuelAssets, NumberOfUniqueBurners, ValueBurnedByChain, AvgValueBurned } from './charts'
import type { ChainName } from '@/constants'

export type FurnaceDataByChain = Record<string, Array<TotalFurnaceData[1]>>
interface Props {
  furnaceData: Array<[ChainName, Array<TotalFurnaceData[1]>]>
}
export const DashboardCharts: FC<Props> = ({ furnaceData }) => {
  const formattedChartData: FurnaceDataByChain =
    furnaceData.reduce<FurnaceDataByChain>(
      (allFurnaceData, currentFurnaceData): FurnaceDataByChain => {
        const [chainName, fuelInfo] = currentFurnaceData
        return {
          ...allFurnaceData,
          [chainName]:
              chainName in allFurnaceData
                ? [...allFurnaceData[chainName], ...fuelInfo]
                : fuelInfo
        }
      },
      {}
    )
  return (
    <Grid container spacing={3}>
      {/* Number of fuel assets per chain */}
      <Grid md={12} lg={6}>
        <Paper sx={{ p: 2 }}>
          <NumberOfFuelAssets fuelAssetData={formattedChartData} />{' '}
        </Paper>
      </Grid>

      {/* Number of unique burners per chains */}
      <Grid md={12} lg={6}>
        <Paper sx={{ p: 2 }}>
          <NumberOfUniqueBurners uniqueBurnersData={formattedChartData}/>
        </Paper>
      </Grid>

      {/* Avg value burned per user */}
      <Grid md={12} lg={6}>
        <Paper sx={{ p: 2 }}>
          <AvgValueBurned fuelAssetData={formattedChartData} />
        </Paper>
      </Grid>

      {/* Value burned by chain  */}
      <Grid md={12} lg={6}>
        <Paper sx={{ p: 2 }}>
          <ValueBurnedByChain valueBurnedData={formattedChartData} />
        </Paper>
      </Grid>
    </Grid>
  )
}
