"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { trackEvent, type AnalyticsEventParams } from "@/lib/analytics";

type TrackedLinkProps = ComponentProps<typeof Link> & {
  eventName: string;
  eventParams?: AnalyticsEventParams;
};

type TrackedAnchorProps = ComponentProps<"a"> & {
  eventName: string;
  eventParams?: AnalyticsEventParams;
};

type TrackedSubmitButtonProps = ComponentProps<"button"> & {
  eventName: string;
  eventParams?: AnalyticsEventParams;
};

export function TrackedLink({ eventName, eventParams, onClick, children, ...props }: TrackedLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    trackEvent(eventName, {
      link_url: typeof props.href === "string" ? props.href : props.href.toString(),
      ...eventParams
    });
    onClick?.(event);
  }

  return (
    <Link {...props} onClick={handleClick}>
      {children}
    </Link>
  );
}

export function TrackedAnchor({ eventName, eventParams, onClick, children, ...props }: TrackedAnchorProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    trackEvent(eventName, {
      link_url: props.href,
      ...eventParams
    });
    onClick?.(event);
  }

  return (
    <a {...props} onClick={handleClick}>
      {children}
    </a>
  );
}

export function TrackedSubmitButton({ eventName, eventParams, onClick, children, ...props }: TrackedSubmitButtonProps) {
  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    trackEvent(eventName, eventParams);
    onClick?.(event);
  }

  return (
    <button {...props} type={props.type || "submit"} onClick={handleClick}>
      {children}
    </button>
  );
}
