import ProductsSection from "@/components/Products/Products";

export default function Products(){
    return (
        <div className="my-component mx-auto">
            <div className="min-h-screen bg-[url('/products.webp')] bg-cover bg-left flex justify-end items-center"/>
            <ProductsSection/>
        </div>
    )
}