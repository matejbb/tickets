import { FC, useEffect, useState } from 'react'
import style from 'components/cinemas/Cinemas.module.scss'
import { Link } from 'react-router-dom'
import { Outlet } from 'react-router'
import {Cinema} from 'types/types'
import axios from 'axios'
import useDebounce from 'utils/hooks/useDebounce'
import { useAppContainer } from './context'

type Props = {}

const Cinemas: FC<Props> = () => {
  const { ip } = useAppContainer()
  const [search, setSearch] = useState<string>("")
  const [cinemas, setCinemas] = useState<Cinema[]>([])
  
  const getCinemas = () => {
    axios.get(`http://${ip}:3020/cinemas`).then(res => setCinemas(res.data))
  }

  useEffect(() => {
    setTimeout(() => {
      getCinemas()
    }, 1000)
  }, [])

  const debouncedQuery = useDebounce(search)

  useEffect(() => {
    if (debouncedQuery.length !== 0) {
      axios
        .get(`http://${ip}:3020/cinemas?search=${debouncedQuery}`)
        .then(res => setCinemas(res.data))
    } else {
      axios.get(`http://${ip}:3020/cinemas`).then(res => setCinemas(res.data))
    }
  }, [debouncedQuery])

  return (
    <>
    <div className={style.back}>
    <div className={style.searchbar}>
      <input
          type='text'
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder='Search cinema'
        />
    </div>
    <div className={style.wrapper}>
      {cinemas.map(cinema => (
        <Link key={cinema.id} to={`/cinemas/cinema/${cinema.id}`} className={style.cinema}>
          {cinema.city} - {cinema.name}
        </Link>
      ))}
      <Outlet />
    </div>
    </div>
    </>
    
  )
}

export default Cinemas
