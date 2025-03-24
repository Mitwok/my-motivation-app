export default function Card(props: { rounded: string }) {
  return (
    <div className="relative lg:row-span-2">
      <div
        className={`absolute inset-px rounded-lg bg-white ${
          props.rounded === "left" && "lg:rounded-l-[2rem] "
        } ${props.rounded === "right" && "lg:rounded-r-[2rem] "} `}
      ></div>
      <div
        className={`relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] ${
          props.rounded === "left" && "lg:rounded-l-[calc(2rem+1px)]"
        } ${props.rounded === "right" && "lg:rounded-r-[calc(2rem+1px)]"}`}
      >
        {/* <div className="px-8 pb-3 pt-8 sm:px-10 sm:pb-0 sm:pt-10">
          <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
            Mobile friendly
          </p>
          <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
            Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui
            lorem cupidatat commodo.
          </p>
        </div> */}
        <div className="relative min-h-[30rem] w-full grow [container-type:inline-size] max-lg:mx-auto max-lg:max-w-sm">
          <div className="absolute inset-x-10 bottom-0 top-10 overflow-hidden rounded-t-[12cqw] border-x-[3cqw] border-t-[3cqw] border-gray-700 bg-gray-900 shadow-2xl">
            <img
              className="size-full object-cover object-top"
              src="https://tailwindui.com/plus/img/component-images/bento-03-mobile-friendly.png"
              alt=""
            />
          </div>
        </div>
      </div>
      <div
        className={`pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 ${
          props.rounded === "left" && "lg:rounded-l-[2rem] "
        } ${props.rounded === "right" && "lg:rounded-r-[2rem] "} `}
      ></div>
    </div>
  );
}
