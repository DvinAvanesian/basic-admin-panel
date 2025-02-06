'use client'

import useTransitionRouter from '@/hooks/useTransitionRouter'
import { useStore } from '@/components/layout'
import vazir from '@/res/fonts/vazir'
import inter from '@/res/fonts/inter'
import { KeyboardArrowLeftRounded, KeyboardArrowRightRounded } from '@mui/icons-material'
import { Breadcrumbs } from '@mui/joy'
import { Typography } from '@mui/material'
import { usePathname } from 'next/navigation'
import styled from 'styled-components'
import { SxProps } from '@mui/joy/styles/types'

const Link = styled(Typography)<{ isActive: boolean }>`
  position: relative;
  height: 2rem;
  margin-top: 0.4rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  cursor: pointer;
  align-items: center;
  opacity: 0.8;
  ${({ isActive }) =>
    isActive &&
    `
    pointer-events: none;
    font-weight: 600;
    opacity: 1;
  `}
`

interface Props {
  titles: any
  sx?: SxProps
}

const CrumbNav: React.FC<Props> = ({ titles, sx }) => {
  const pathname = usePathname()
  const pathArray = pathname.split('/').filter(Boolean)
  const crumbSegments = pathArray.map((_, index) => `/${pathArray.slice(0, index + 1).join('/')}`)
  const store = useStore()
  const { lang, dynamicPageNames } = store.getUI()
  const router = useTransitionRouter()

  const getTitle = (item: string) => {
    if (titles[item]) return titles[item]

    for (const route of Object.keys(titles)) {
      if (/\/\$[0-9]+/g.test(route)) {
        let routeName
        const changedRoute = route.replace(/\$(\d+)/g, (match, index) => {
          const idx = parseInt(index, 10)
          if (dynamicPageNames[idx]) {
            routeName = dynamicPageNames[idx].replace
            return dynamicPageNames[idx].str
          }
          return match
        })
        if (item === changedRoute) return /\/\$[0-9]+$/.test(route) ? routeName : titles[route]
      }
    }

    return ''
  }

  return (
    <Breadcrumbs
      sx={{ px: 0, ...sx }}
      separator={
        lang === 'fa' ? (
          <KeyboardArrowLeftRounded sx={{ fontSize: '1.7rem', mt: { xs: 0, lg: -1 } }} />
        ) : (
          <KeyboardArrowRightRounded sx={{ fontSize: '1.7rem', mt: { xs: -0.2, lg: -1 } }} />
        )
      }
    >
      {crumbSegments.map((item, index) => (
        <Link
          key={item}
          isActive={index === crumbSegments.length - 1}
          onClick={() => router.route(item, true)}
          onTouchEnd={() => router.route(item, true)}
          sx={{
            fontSize: { xs: '1.2rem', lg: '1rem' },
            WebkitTapHighlightColor: 'transparent',
            userSelect: 'none'
          }}
          className={lang === 'fa' ? vazir.className : inter.className}
        >
          {getTitle(item)}
        </Link>
      ))}
    </Breadcrumbs>
  )
}

export default CrumbNav
