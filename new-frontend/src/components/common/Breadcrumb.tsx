import Link from "next/link";
import { Fragment } from "react";

interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 font-mono text-[12.5px] text-muted-fg">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <Fragment key={`${item.label}-${index}`}>
            {index > 0 && <span className="opacity-50">/</span>}
            {item.href && !isLast ? (
              <Link href={item.href} className="hover:text-fg">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "text-accent-fg" : undefined}>{item.label}</span>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
