import Link from "next/link";
import Label from "../ui/label";

export default function CategoryLabel({
  categories,
  nomargin = false
}) {
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-0">
      {categories?.length &&
        categories.slice(0).map((category, index) => (
          <Link
            href={`/kat/${category.slug}`}
            key={index}>
            <Label nomargin={nomargin} color={category.color}>
              {category.title}
            </Label>
          
          </Link>
        ))}
    </div>
  );
}
