import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function MovieSearchPage({ searchQuery, filteredMovies }) {
  return (
    <>
      <h1 className="text-3xl ml-[60pt] mt-[20pt] mb-[10pt] mr-[60pt]">
        Search Results for: <span className="italic">{searchQuery}</span>
      </h1>
      <Separator className="" />
      <div className="flex justify-center flex-wrap gap-5 px-[5pt] mt-[10pt]">
        {filteredMovies.map((movie, index) => (
          <Card key={index} className="w-[190pt] h-[250pt]">
            <CardHeader>
              <CardTitle>{movie.name}</CardTitle>
            </CardHeader>
            <CardContent></CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
