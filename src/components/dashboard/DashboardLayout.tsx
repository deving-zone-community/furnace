'use client'
import {
  Unstable_Grid2 as Grid,
  Paper,
  Skeleton,
  styled,
  Typography
} from '@mui/material'
import React, { type FC } from 'react'
import { DashboardCharts, DashboardTable } from '@/components'
import { furnaceSelector } from '@/state'
import { useRecoilValueLoadable } from 'recoil'
import { ENDPOINTS } from '@/constants'

const DashboardBox = styled(Paper)({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  justifyContent: 'space-between',
  alignContent: 'center',
  padding: 20
})

export const DashboardLayout: FC = () => {
  const allFurnaceData = useRecoilValueLoadable(furnaceSelector)
  const isLoading = allFurnaceData.state === 'loading'
  const furnaceData = Object.entries(allFurnaceData.valueMaybe() ?? isLoading)
  const loading = isLoading || furnaceData.length === 0
  return (
    <Grid gap={3} xl={9} alignSelf='center' justifyContent="center" container>
    <DashboardBox>
      <Typography>Chains Supported</Typography>
      <Typography sx={{ fontSize: 20, fontWeight: 'bold' }}>
      {Object.keys(ENDPOINTS).length}
      </Typography>
    </DashboardBox>
    <DashboardBox>
      <Typography>Assets Supported</Typography>
      <Typography sx={{ fontSize: 20, fontWeight: 'bold' }}>
        {loading ? <Skeleton width={100}/> : furnaceData.map(([_, chainInfo]) => chainInfo.length).reduce((x, y) => x + y, 0)}
      </Typography>
    </DashboardBox>
    <Grid xs={12}>
      <DashboardBox>
        <DashboardTable furnaceData={furnaceData} />
      </DashboardBox>
    </Grid>
    <Grid xs={12}>
      <DashboardCharts furnaceData={furnaceData} chartLoading={loading} />
    </Grid>
  </Grid>
  )
}
