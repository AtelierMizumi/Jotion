import Image from "next/image";


export const Carousel = () => {
  return (
    <div style={{background:"#1f1f1f", color:"white"}}>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold py-12">
            A fresh take on writing your notes
        </h2>
             <div className="flex flex-col gap-10 pt-12">
                <div>
                    <div className="max-w-[40rem] pl-8 text-left">
                        <h3 className="mb-2 text-4xl font-bold">Introducing Blocks</h3>
                        <p className="mb-8 text-4xl font-light leading-tight">
                            Everything you need to do your best work.
                        </p>
                    </div>
                    <Image
                        alt="Illustration showing how blocks can be formatted"
                        loading="lazy"
                        width="768"
                        height="500"
                        decoding="async"
                        data-nimg="1"
                        className="h-auto w-full"
                        style={{ color:"transparent"}}
                        sizes="100vw"
                        src="./jotion-about-1.png"
                    />
                </div>
                <div>
                    <div className="max-w-[40rem] pr-8 pt-12 ml-auto text-right">
                        <h3 className="mb-2 text-4xl font-bold">Dive in to the formats</h3>
                        <p className="mb-8 text-4xl font-light leading-tight">
                            More than just writing, style your text in your desired ways
                        </p>
                    </div>
                <video
                    className="h-auto w-full"
                    style={{ color: "transparent" }}
                    autoPlay
                    muted
                    playsInline
                    loop
                >
                    <source src="./jotion-about-2.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>
        <div className="mt-20 pt-20 flex w-full">
            <div className="relative h-12 w-full lg:h-20">
                <Image 
                    alt=""
                    loading="lazy" 
                    decoding="async" 
                    data-nimg="fill" 
                    className="object-cover" 
                    style={{ position:"absolute",height:"100%",width:"100%",left:"0",top:0,right:0,bottom:0,color:"transparent"}} 
                    sizes="100vw" 
                    src="./footer.svg"
                />
            </div>
        </div>
    </div>

  )
}