import { format, isBefore, isToday, isYesterday, subDays } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

export function checkDateIsCurrentWeek(date: Date) {
  const startOfCurrentWeek = subDays(new Date(), 7)
  const isDateBeforeCurrentWeek = isBefore(date, startOfCurrentWeek)

  if (isDateBeforeCurrentWeek) {
    return format(date, 'dd/MM/yyyy', {
      locale: ptBR,
    })
  } else {
    if (isToday(date)) {
      return 'Hoje'
    } else if (isYesterday(date)) {
      return 'Ontem'
    } else {
      return format(date, 'EEEE', {
        locale: ptBR,
      })
    }
  }
}
