"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"
import Image from "next/image"

type Movie = {
  title: string
  releaseYear: string
  genre: string
  coverUrl: string
}

type MovieSummary = Movie & {
  generatedSummary: string
}

const BASE_URL = "https://y6fyxfdzr3.execute-api.ap-south-1.amazonaws.com/v1"

const MovieExplorer = () => {
  const [movies, setMovies] = useState<Movie[]>([])
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([])
  const [yearFilter, setYearFilter] = useState("")
  const [selectedMovie, setSelectedMovie] = useState<MovieSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMovies()
  }, [])

  const fetchMovies = async () => {
    try {
      const response = await fetch(`${BASE_URL}/getmovies`)
      if (!response.ok) throw new Error("Failed to fetch movies")
      const data = await response.json()
      setMovies(data)
      setFilteredMovies(data)
      setLoading(false)
    } catch (err) {
      setError(`Failed to load movies. Please try again later. ${err}`)
      setLoading(false)
    }
  }

  const filterMoviesByYear = async () => {
    if (!yearFilter) {
      setFilteredMovies(movies)
      return
    }
    try {
      const response = await fetch(`${BASE_URL}/getmoviesbyyear/${yearFilter}`)
      if (!response.ok) throw new Error("Failed to fetch movies by year")
      const data = await response.json()
      setFilteredMovies(data)
    } catch (err) {
      setError(`Failed to filter movies. Please try again later. ${err}`)
    }
  }

  const fetchMovieSummary = async (movieTitle: string) => {
    setSummaryLoading(true)
    try {
      const response = await fetch(
        `${BASE_URL}/generatemoviesummary/${encodeURIComponent(movieTitle)}`
      )
      if (!response.ok) throw new Error("Failed to fetch movie summary")
      const data = await response.json()
      setSelectedMovie(data)
    } catch (err) {
      setError(`Failed to load movie. Please try again later. ${err}`)
    } finally {
      setSummaryLoading(false)
    }
  }

  const resetFilters = () => {
    setYearFilter("")
    setFilteredMovies(movies)
  }

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    )
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    )

  return (
    <div className="container mx-auto p-4">
      <h1
        className="text-3xl font-bold mb-6 text-center cursor-pointer hover:text-primary transition-colors"
        onClick={resetFilters}
      >
        Movie Explorer
      </h1>
      <div className="flex gap-4 mb-6">
        <Input
          type="text"
          placeholder="Filter by year"
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="max-w-xs"
        />
        <Button onClick={filterMoviesByYear}>Filter</Button>
        {yearFilter && (
          <Button variant="outline" onClick={resetFilters}>
            Reset
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredMovies.map((movie) => (
          <Dialog key={movie.title}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{movie.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Image
                    src={movie.coverUrl}
                    alt={movie.title}
                    className="w-full h-48 object-cover rounded-md"
                  />
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-muted-foreground">
                    {movie.releaseYear} • {movie.genre}
                  </p>
                </CardFooter>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{movie.title}</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <Image
                  src={movie.coverUrl}
                  alt={movie.title}
                  className="w-full h-64 object-cover rounded-md mb-4"
                />
                <p>
                  <strong>Year:</strong> {movie.releaseYear}
                </p>
                <p>
                  <strong>Genre:</strong> {movie.genre}
                </p>
                {selectedMovie && selectedMovie.title === movie.title && (
                  <p className="mt-4">
                    <strong>Summary:</strong> {selectedMovie.generatedSummary}
                  </p>
                )}
                {(!selectedMovie || selectedMovie.title !== movie.title) && (
                  <Button
                    onClick={() => fetchMovieSummary(movie.title)}
                    className="mt-4"
                    disabled={summaryLoading}
                  >
                    {summaryLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Summary...
                      </>
                    ) : (
                      "Generate Summary"
                    )}
                  </Button>
                )}
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  )
}

export default MovieExplorer
