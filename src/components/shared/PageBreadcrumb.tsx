import { Fragment } from "react";
import { Link } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export interface Crumb {
  label: string;
  /** Rota interna. Omitir (ou no último item) renderiza como página atual. */
  to?: string;
}

/**
 * Breadcrumb visual reutilizável para hubs e páginas internas (redesign v2).
 * O último item é sempre a página atual. Use em conjunto com o helper
 * `breadcrumb()` de JsonLd para manter o BreadcrumbList estruturado em sincronia.
 */
export function PageBreadcrumb({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <Fragment key={item.label}>
              <BreadcrumbItem>
                {isLast || !item.to ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={item.to}>{item.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
