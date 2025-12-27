"use client"

import * as React from "react"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

type Props = {
  page: number
  lastPage: number
  disabled?: boolean
  onPageChange: (page: number) => void
}

export function ShadcnPaginationBar({ page, lastPage, disabled, onPageChange }: Props) {
  const canPrev = page > 1
  const canNext = page < lastPage

  const items = React.useMemo(() => {
    const total = lastPage
    const current = page
    const windowSize = 1

    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1) as Array<number | "ellipsis">

    const start = Math.max(2, current - windowSize)
    const end = Math.min(total - 1, current + windowSize)

    const result: Array<number | "ellipsis"> = [1]
    if (start > 2) result.push("ellipsis")
    for (let p = start; p <= end; p++) result.push(p)
    if (end < total - 1) result.push("ellipsis")
    result.push(total)

    return result
  }, [page, lastPage])

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault()
              if (disabled || !canPrev) return
              onPageChange(page - 1)
            }}
            className={disabled || !canPrev ? "pointer-events-none opacity-50" : undefined}
          />
        </PaginationItem>

        {items.map((it, idx) => {
          if (it === "ellipsis") {
            return (
              <PaginationItem key={`el-${idx}`}>
                <PaginationEllipsis />
              </PaginationItem>
            )
          }

          return (
            <PaginationItem key={it}>
              <PaginationLink
                href="#"
                isActive={it === page}
                onClick={(e) => {
                  e.preventDefault()
                  if (disabled) return
                  onPageChange(it)
                }}
              >
                {String(it)}
              </PaginationLink>
            </PaginationItem>
          )
        })}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault()
              if (disabled || !canNext) return
              onPageChange(page + 1)
            }}
            className={disabled || !canNext ? "pointer-events-none opacity-50" : undefined}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
