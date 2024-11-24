import Image from "next/image";
import { CheckSquare, Calendar, Bot } from "lucide-react";


/**
 * A carousel component that showcases different features of the note-taking application.
 * Displays three main sections: Blocks introduction, formatting options, and AI capabilities.
 * Includes responsive images, video, and icons with descriptive text.
 * 
 * @component Carousel
 * @returns {JSX.Element} A carousel section with feature descriptions and visual content
 * 
 * @example
 * ```tsx
 * <Carousel />
 * ```
 * 
 * @Vietnamese
 * Một component carousel giới thiệu các tính năng của ứng dụng ghi chú.
 * Hiển thị ba phần chính: Giới thiệu về Blocks, tùy chọn định dạng và khả năng AI.
 * Bao gồm hình ảnh tương thích, video và biểu tượng kèm theo văn bản mô tả.
 * 
 * @returns {JSX.Element} Một phần carousel với mô tả tính năng và nội dung trực quan
 */
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
                        src="/jotion-about-1.png"
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
                        <source src="/jotion-about-2.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                <div>
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-start justify-between gap-12">
                        {/* Text Section */}
                        <div className="max-w-[40rem] pt-12 pl-8 text-left">
                        <h3 className="mb-2 text-4xl font-bold">Now with AI✨</h3>
                        <p className="mb-8 text-4xl font-light leading-tight">
                            Built right into your workspace. Jotion is ready to brainstorm, summarize, help you write, and find what you&apos;re looking for.
                        </p>
                        </div>

                        {/* Icons Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:max-w-[50%] w-full pt-12">
                        {/* Tasks and to-dos */}
                        <div className="flex flex-col items-center text-center">
                            <div className="mb-4 p-2">
                            <CheckSquare className="w-12 h-12" />
                            </div>
                            <h4 className="text-xl font-semibold mb-2">Ask anything</h4>
                            <p>Note like never before with the help of AI.</p>
                        </div>

                        {/* Custom views */}
                        <div className="flex flex-col items-center text-center">
                            <div className="mb-4 p-2">
                            <Calendar className="w-12 h-12" />
                            </div>
                            <h4 className="text-xl font-semibold mb-2">It can be anything</h4>
                            <p>Explaining, expanding, summerize, translate... or just type in your own!</p>
                        </div>

                        {/* Automations */}
                        <div className="flex flex-col items-center text-center">
                            <div className="mb-4 p-2">
                            <Bot className="w-12 h-12" />
                            </div>
                            <h4 className="text-xl font-semibold mb-2">Have you ever thought about it</h4>
                            <p>Put tedious tasks on autopilot and get the better grasp of your lecture.</p>
                        </div>
                        </div>
                    </div>
                    </div>
                    <Image
                        alt="Illustration showing AI capabilities"
                        loading="lazy"
                        width="768"
                        height="500"
                        decoding="async"
                        data-nimg="1"
                        className="h-auto w-full rounded-lg mb-4"
                        style={{ color:"transparent"}}
                        src="/jotion-about-3.png"
                    />
                </div>
            </div>
        </div>
        <div className="mt-20 pt-20 flex w-full">
            <div className="relative h-12 w-full lg:h-20">
                <Image 
                    alt="Footer vector graphic"
                    loading="lazy"
                    width="768"
                    height="500"
                    decoding="async" 
                    data-nimg="fill" 
                    className="object-cover" 
                    style={{ position:"absolute",height:"100%",width:"100%",left:"0",top:0,right:0,bottom:0,color:"transparent"}} 
                    sizes="100vw" 
                    src="/footer.svg"
                />
            </div>
        </div>
    </div>

  )
}