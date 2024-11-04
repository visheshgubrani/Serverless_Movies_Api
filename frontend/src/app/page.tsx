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
  DialogClose,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, X } from "lucide-react"
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

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

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
    if (!yearFilter.trim()) {
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
      setFilteredMovies(movies)
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
      setError(`Failed to load movie summary. Please try again later. ${err}`)
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
        <Loader2 className="h-6 w-6 animate-spin" />
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
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input
          type="text"
          placeholder="Filter by year"
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="max-w-xs w-full"
        />
        <Button onClick={filterMoviesByYear} className="w-full sm:w-auto">
          Filter
        </Button>
        {yearFilter && (
          <Button
            variant="outline"
            onClick={resetFilters}
            className="w-full sm:w-auto"
          >
            Reset
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {filteredMovies.map((movie, index) => (
          <Dialog key={`${movie.title}-${index}`}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{movie.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Image
                    src={movie.coverUrl}
                    alt={movie.title}
                    width={300}
                    height={192}
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
            <DialogContent className="sm:max-w-[425px] h-[90vh] p-0 overflow-hidden flex flex-col">
              <DialogHeader className="px-4 py-2 sticky top-0 bg-background z-10 flex-shrink-0">
                <DialogTitle>{movie.title}</DialogTitle>
                <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </DialogClose>
              </DialogHeader>
              <ScrollArea className="flex-grow">
                <div className="p-4 pb-8">
                  <Image
                    src={movie.coverUrl}
                    alt={movie.title}
                    width={600}
                    height={384}
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
              </ScrollArea>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  )
}

export default MovieExplorer
