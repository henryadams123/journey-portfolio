import { useState, type ImgHTMLAttributes } from "react";

/**
 * Smart <Image> with blur-up + responsive AVIF/WebP via vite-imagetools.
 *
 * Usage:
 *   import pic from "@/assets/foo.jpg?w=480;960;1600&format=avif;webp;jpg&as=picture";
 *   <Image picture={pic} alt="..." className="..." />
 *
 * For LQIP, also import the blurred placeholder:
 *   import lqip from "@/assets/foo.jpg?w=24&format=webp&blur=20";
 *   <Image picture={pic} placeholder={lqip} alt="..." />
 */
export type Picture = {
  sources: Record<string, { src: string; w?: number }[] | string>;
  img: { src: string; w?: number; h?: number };
};

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  picture: Picture | string;
  placeholder?: string;
  aspect?: string; // e.g. "4 / 5"
};

export function Image({ picture, placeholder, aspect, className, alt = "", ...rest }: Props) {
  const [loaded, setLoaded] = useState(false);

  if (typeof picture === "string") {
    return (
      <img
        src={picture}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={className}
        style={aspect ? { aspectRatio: aspect } : undefined}
        {...rest}
      />
    );
  }

  return (
    <span
      className={"relative block overflow-hidden " + (className ?? "")}
      style={aspect ? { aspectRatio: aspect } : undefined}
    >
      {placeholder && (
        <img
          src={placeholder}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl transition-opacity duration-700"
          style={{ opacity: loaded ? 0 : 1 }}
        />
      )}
      <picture>
        {Object.entries(picture.sources).map(([type, srcset]) => (
          <source
            key={type}
            type={`image/${type}`}
            srcSet={
              typeof srcset === "string"
                ? srcset
                : srcset.map((s) => `${s.src}${s.w ? ` ${s.w}w` : ""}`).join(", ")
            }
          />
        ))}
        <img
          src={picture.img.src}
          width={picture.img.w}
          height={picture.img.h}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          className="relative w-full h-full object-cover"
          {...rest}
        />
      </picture>
    </span>
  );
}
