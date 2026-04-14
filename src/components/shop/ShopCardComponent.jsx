import Link from "next/link";
import Image from "next/image";
import { StarRow } from "../ProductCardComponent";

const categoryTone = {
    Skincare: "bg-sky-50 text-sky-800",
    Makeup: "bg-violet-50 text-violet-800",
    Fragrance: "bg-amber-50 text-amber-900",
    Haircare: "bg-emerald-50 text-emerald-900",
};

function badgeClass(label) {
    return categoryTone[label] ?? "bg-indigo-50 text-indigo-800";
}

const btnClass =
    "mt-2 block w-full rounded-xl border border-gray-900 bg-gray-900 py-2.5 text-center text-sm font-medium text-white transition hover:bg-gray-800";

export default function ShopCardComponent({ product }) {
    const id = product?.productId ?? product?.id;
    const name = product?.productName ?? product?.name ?? "—";
    const description = product?.description ?? "";
    const price = product?.price ?? 0;
    const imageUrl = product?.imageUrl ?? null;
    const brand = product?.brand ?? "";
    const categoryName = product?.categoryName ?? product?.category?.categoryName ?? "";

    return (
        <article className="group max-w-[300px] flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="relative aspect-square overflow-hidden bg-gray-100">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-cover"
                    />
                ) : (
                    <div className="flex size-full items-center justify-center text-gray-300 text-4xl">◇</div>
                )}
            </div>
            <div className="flex flex-1 flex-col gap-3 p-5">
                <div>
                    {brand && <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{brand}</p>}
                    <h3 className="font-semibold leading-snug text-gray-900">{name}</h3>
                    <p className="mt-1 min-h-10 line-clamp-2 text-sm leading-5 text-gray-500">{description}</p>
                </div>
                <StarRow />
                <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-2">
                    <p className="text-xl font-semibold tabular-nums text-gray-900">${price}</p>
                    {categoryName && (
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${badgeClass(categoryName)}`}>
                            {categoryName}
                        </span>
                    )}
                </div>
                <Link href={`/products/${id}`} className={btnClass}>
                    View Product
                </Link>
            </div>
        </article>
    );
}
