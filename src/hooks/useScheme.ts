import { useQuery, useQueryClient } from "@tanstack/react-query"
import { getCookie, setCookie } from "cookies-next"
import { useEffect } from "react"
import { CONFIG } from "site.config"
import { queryKey } from "src/constants/queryKey"
import { SchemeType } from "src/types"

type SetScheme = (scheme: SchemeType) => void

const useScheme = (): [SchemeType, SetScheme] => {
  const queryClient = useQueryClient()
  const followsSystemTheme = CONFIG.blog.scheme === "system"

  // Add type assertion to ensure 'data' is of type SchemeType
  const { data } = useQuery<SchemeType>({
    queryKey: queryKey.scheme(),
    enabled: false,
    initialData: followsSystemTheme
      ? "dark"  // Default to "dark" if the system theme is followed
      : (CONFIG.blog.scheme === "light" ? "light" : "dark"),  // Force light or dark from the config
  })

  const setScheme = (scheme: SchemeType) => {
    setCookie("scheme", scheme)
    queryClient.setQueryData(queryKey.scheme(), scheme)
  }

  useEffect(() => {
    if (!window) return

    const cachedScheme = getCookie("scheme") as SchemeType
    const defaultScheme = followsSystemTheme
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : data
    setScheme(cachedScheme || defaultScheme)
  }, [data, followsSystemTheme]) // Add `data` and `followsSystemTheme` as dependencies

  return [data, setScheme]
}

export default useScheme
