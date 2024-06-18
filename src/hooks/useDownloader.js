import axios from "axios"
import { useCallback, useState } from "react"

const useDownloader = () => {
  const [loader, setLoader] = useState(false)

  const download = useCallback(async ({fileId, url, fileName}) => {
    const objectUrl =
      url ?? process.env.REACT_APP_CDN_API_URL + "/file/" + fileId + "/download"

    setLoader(true)
    try {
      const res = await axios.get(objectUrl, {
        responseType: "blob",
      })

      const imageObjectURL = URL.createObjectURL(res.data)
      
      
      const link = document.createElement("a")
      link.href = imageObjectURL
      link.setAttribute("download", fileName)
      document.body.appendChild(link)
      link.click()

    } catch (error) {
      console.log(error)
    }
    finally {
      setLoader(false)
    }
  }, [])

  return [download, loader]
}

export default useDownloader
