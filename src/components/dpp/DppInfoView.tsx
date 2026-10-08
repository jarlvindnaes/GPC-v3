import React, { useEffect, useState } from "react";
import { DppCollapsibleSection } from "./DppCollapsibleSection";
import { uiIcons } from "./dppIcons";
import { slopeChair } from "./dppProductData";

const data = slopeChair;

/** Simple inline divider */
function Divider() {
  return <div aria-hidden="true" className="h-px w-full shrink-0 bg-[#d5d5d5]" />;
}

const specifications = [
  { label: "Product Name", value: data.categorization.modelName },
  { label: "Category", value: `${data.categorization.category} / ${data.categorization.subCategory}` },
  { label: "Manufacturer", value: data.identity.brandName },
  {
    label: "Dimensions",
    lines: [
      `H: ${data.categorization.dimensions.height.value} ${data.categorization.dimensions.height.unit}`,
      `W: ${data.categorization.dimensions.width.value} ${data.categorization.dimensions.width.unit}`,
      `D: ${data.categorization.dimensions.depth.value} ${data.categorization.dimensions.depth.unit}`
    ]
  },
  {
    label: "Weight",
    value: `${data.materialsAndComponents.totalWeight.value} ${data.materialsAndComponents.totalWeight.unit}`
  },
  ...(data.categorization.color ? [{ label: "Colour", value: data.categorization.color }] : [])
];

interface DppInfoViewProps {
  scrollRef?: React.RefObject<HTMLDivElement | null>;
}

export default function DppInfoView({ scrollRef }: DppInfoViewProps) {
  const [historyOpen, setHistoryOpen] = useState(true);
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const [specificationsOpen, setSpecificationsOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(true);

  useEffect(() => {
    if (scrollRef?.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [scrollRef]);

  return (
    <div className="relative w-full pb-[80px]">
      {/* Hero Image */}
      <div className="w-full shrink-0" data-name="big 1">
        <img
          alt={`${data.categorization.displayName} — ${data.categorization.category.toLowerCase()} by ${data.identity.brandName}`}
          className="pointer-events-none block w-full"
          src={data.commerce.photographs.hero}
        />
      </div>

      {/* Title Section */}
      <div
        className="w-full whitespace-pre text-nowrap px-[16px] py-[24px] font-['SF_Pro:Regular',sans-serif] font-normal font-width-normal text-[16px] text-[rgba(50,47,49,0.58)] leading-[24px]"
        data-name="Title"
      >
        <h1 className="mb-0 font-['SF_Pro:Bold',sans-serif] font-bold font-width-normal text-[16px] text-[rgba(50,47,49,0.62)] leading-[24px]">
          {data.categorization.displayName}
        </h1>
        <p>{`Designed by ${data.categorization.designer}`}</p>
      </div>

      <Divider />

      {/* Your products history Section */}
      <DppCollapsibleSection
        title="Your products history"
        isOpen={historyOpen}
        onToggle={() => setHistoryOpen(!historyOpen)}
      >
        <div className="relative h-[404px] w-full shrink-0 overflow-clip">
          <p className="absolute top-[15px] left-0 whitespace-pre text-nowrap font-['SF_Pro:Light',sans-serif] font-[274.315] font-width-normal text-[16px] text-[rgba(50,47,49,0.62)] leading-[24px]">
            {data.lifecycleAndMaintenance.productAgeStatement}
          </p>

          {/* Timeline entries */}
          <div className="absolute top-[62px] left-[64px] flex h-[304px] w-[243px] flex-col content-stretch items-start justify-between overflow-clip">
            {data.lifecycleAndMaintenance.productHistory.map((event) => (
              <div
                key={event.title}
                className="relative h-[52px] w-full shrink-0 whitespace-pre text-nowrap font-['SF_Pro:Medium',sans-serif] font-[510]"
              >
                <p className="absolute top-[6px] left-0 font-['SF_Pro:Bold',sans-serif] font-bold font-width-normal text-[16px] text-[rgba(50,47,49,0.62)] leading-[24px]">
                  {event.title}
                </p>
                <time
                  dateTime={event.date}
                  className="absolute top-[28px] left-0 block font-width-normal text-[14px] text-[rgba(50,47,49,0.58)] leading-[20px]"
                >
                  {new Date(event.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  })}
                </time>
              </div>
            ))}
          </div>

          {/* Timeline icons and lines */}
          <div className="absolute top-[70px] left-0 h-[290px] w-[38px]">
            <svg
              aria-hidden="true"
              className="block size-full"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 38 290"
            >
              <g id="Frame 21">
                <g id="Objects / star">
                  <rect fill="white" fillOpacity="0.01" height="24" transform="translate(7)" width="24" />
                  <path
                    clipRule="evenodd"
                    d={uiIcons.p343608f0}
                    fill="var(--fill-0, #000713)"
                    fillOpacity="0.624"
                    fillRule="evenodd"
                    id="Vector"
                  />
                </g>
                <line
                  id="Line 1"
                  opacity="0.8"
                  stroke="var(--stroke-0, #000713)"
                  strokeOpacity="0.624"
                  x1="19.5"
                  x2="19.5"
                  y1="36"
                  y2="74"
                />
                <g id="Objects / archive">
                  <rect fill="white" fillOpacity="0.01" height="24" transform="translate(7 86)" width="24" />
                  <path
                    clipRule="evenodd"
                    d={uiIcons.p10206000}
                    fill="var(--fill-0, #000713)"
                    fillOpacity="0.624"
                    fillRule="evenodd"
                    id="Vector_2"
                  />
                </g>
                <line
                  id="Line 2"
                  opacity="0.8"
                  stroke="var(--stroke-0, #000713)"
                  strokeOpacity="0.624"
                  x1="19.5"
                  x2="19.5"
                  y1="122"
                  y2="160"
                />
                <g id="Objects / qr">
                  <rect fill="white" fillOpacity="0.01" height="24" transform="translate(7 172)" width="24" />
                  <path d={uiIcons.p299c1700} fill="var(--fill-0, #000713)" fillOpacity="0.624" id="Vector_3" />
                </g>
                <line
                  id="Line 3"
                  opacity="0.8"
                  stroke="var(--stroke-0, #000713)"
                  strokeOpacity="0.624"
                  x1="19.5"
                  x2="19.5"
                  y1="208"
                  y2="246"
                />
                <g id="Objects / add-to-basket">
                  <rect fill="white" fillOpacity="0.01" height="32" transform="translate(3 258)" width="32" />
                  <path d={uiIcons.p3cc1ed00} fill="var(--fill-0, #000713)" fillOpacity="0.624" id="Vector_4" />
                </g>
              </g>
            </svg>
          </div>
        </div>
      </DppCollapsibleSection>

      <Divider />

      {/* Specifications Section */}
      <DppCollapsibleSection
        title="Specifications"
        isOpen={specificationsOpen}
        onToggle={() => setSpecificationsOpen(!specificationsOpen)}
      >
        <dl className="relative m-0 w-full shrink-0 pb-[20px] font-['SF_Pro:Regular','Noto_Sans:Regular',sans-serif] font-normal font-width-normal text-[16px] text-[rgba(50,47,49,0.62)] leading-[24px]">
          {specifications.map((spec, index) => (
            <React.Fragment key={spec.label}>
              <dt className="mb-0 font-['SF_Pro:Bold','Noto_Sans:Regular',sans-serif] font-bold font-width-normal">
                {spec.label}
              </dt>
              <dd className="mb-0 ml-0">
                {"lines" in spec
                  ? spec.lines.map((line, lineIndex) => (
                      <React.Fragment key={`${spec.label}-${line}`}>
                        {line}
                        {lineIndex < spec.lines.length - 1 && <br aria-hidden="true" />}
                      </React.Fragment>
                    ))
                  : spec.value}
              </dd>
              {index < specifications.length - 1 && <div className="h-[24px]" aria-hidden="true" />}
            </React.Fragment>
          ))}
        </dl>
      </DppCollapsibleSection>

      <Divider />

      {/* Description Section */}
      <DppCollapsibleSection
        title="Description"
        isOpen={descriptionOpen}
        onToggle={() => setDescriptionOpen(!descriptionOpen)}
      >
        <div className="flex w-full flex-col gap-[24px] pb-[20px]">
          <p className="relative w-full shrink-0 whitespace-pre-wrap font-['SF_Pro:Regular',sans-serif] font-normal font-width-normal text-[16px] text-[rgba(50,47,49,0.62)] leading-[24px]">
            {data.commerce.description}
          </p>
          {data.commerce.photographs.dimensionsDiagram && (
            <figure className="m-0 w-full shrink-0" data-name="image_01 1">
              <img
                alt={`Dimensions diagram: H ${data.categorization.dimensions.height.value}${data.categorization.dimensions.height.unit} × W ${data.categorization.dimensions.width.value}${data.categorization.dimensions.width.unit} × D ${data.categorization.dimensions.depth.value}${data.categorization.dimensions.depth.unit}`}
                className="pointer-events-none block w-full"
                src={data.commerce.photographs.dimensionsDiagram}
              />
            </figure>
          )}
        </div>
      </DppCollapsibleSection>

      <Divider />

      {/* Company Section */}
      <DppCollapsibleSection
        title={data.company.contact.companyName}
        isOpen={companyOpen}
        onToggle={() => setCompanyOpen(!companyOpen)}
      >
        <p className="relative w-full shrink-0 whitespace-pre-wrap pb-[20px] font-['SF_Pro:Regular',sans-serif] font-normal font-width-normal text-[16px] text-[rgba(50,47,49,0.62)] leading-[24px]">
          {data.company.description}
        </p>
      </DppCollapsibleSection>

      <Divider />

      {/* Image 1 */}
      {data.commerce.photographs.lifestyle && (
        <div className="w-full shrink-0" data-name="image 1">
          <img
            alt={`${data.categorization.displayName} in a lifestyle setting`}
            className="pointer-events-none block w-full"
            src={data.commerce.photographs.lifestyle}
          />
        </div>
      )}

      <Divider />

      {/* Contact Us Section */}
      <DppCollapsibleSection title="Contact Us" isOpen={contactOpen} onToggle={() => setContactOpen(!contactOpen)}>
        <address className="relative w-full shrink-0 pb-[20px] font-['SF_Pro:Regular',sans-serif] font-normal font-width-normal text-[16px] text-[rgba(50,47,49,0.62)] not-italic leading-[24px]">
          <p className="mb-0 font-['SF_Pro:Bold',sans-serif] font-bold font-width-normal">{"Showroom & office: "}</p>
          <p className="mb-0">{`${data.company.contact.companyName} `}</p>
          {data.company.contact.addressLines.map((line) => (
            <p key={line} className="mb-0">{`${line} `}</p>
          ))}
          <p className="mb-0">
            <br />
          </p>
          {data.company.contact.phone && (
            <p className="mb-0">
              <a
                className="focus-visible:outline-2 focus-visible:outline-[#6C7254] focus-visible:outline-offset-2"
                href={`tel:${data.company.contact.phone.replace(/\s/g, "")}`}
              >{`${data.company.contact.phone} `}</a>
            </p>
          )}
          <p className="mb-0">
            <a
              className="focus-visible:outline-2 focus-visible:outline-[#6C7254] focus-visible:outline-offset-2"
              href={`mailto:${data.company.contact.email}`}
            >{`${data.company.contact.email} `}</a>
          </p>
          <a
            className="block cursor-pointer underline decoration-solid [text-underline-position:from-font] focus-visible:outline-2 focus-visible:outline-[#6C7254] focus-visible:outline-offset-2"
            href={data.company.contact.websiteUrl}
          >
            {data.company.contact.website}
          </a>
          {data.identity.economicOperatorId && (
            <p className="mt-[8px] mb-0 text-[13px] leading-[20px]">{data.identity.economicOperatorId}</p>
          )}
        </address>
      </DppCollapsibleSection>

      {/* Digital Product Passport */}
      <div className="mx-[16px] mb-[24px] flex w-[calc(100%-32px)] flex-col items-center rounded-[12px] border border-[rgba(0,0,0,0.06)] bg-[rgba(0,0,0,0.035)] px-[14px] pt-[14px] pb-[12px] text-center">
        {/* Product Connect logo */}
        <svg className="mb-[8px] block h-[22px] w-[20px]" viewBox="0 0 417 451" fill="none" aria-hidden="true">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M208.5 0L0 95.6667V343.983L15.5888 351.448V111.259L202.543 196.196V429.576L15.5888 333.741V351.448L208.5 451L417 341.667V95.6667L208.5 0ZM208.5 16.8786L27.5896 99.8863L208.5 182.894L389.411 99.8863L208.5 16.8786ZM400.819 230.12C399.446 222.906 378.855 202.128 347.959 202.575C302.652 203.231 245.673 253.729 218.9 315.378C217.192 319.313 218.9 323.99 223.02 325.215C226.372 326.212 230.069 324.523 231.258 321.28C240.868 295.047 283.43 226.185 343.841 222.25C371.947 220.419 382.059 236.283 384.944 240.809C385.179 241.179 385.367 241.472 385.512 241.674C385.593 241.787 385.66 241.872 385.716 241.925C389.148 246.516 393.542 246.384 397.386 243.236C401.23 240.089 402.192 237.334 400.819 230.12ZM378.165 264.879C376.106 260.944 359.63 244.698 341.095 245.859C299.219 248.483 265.582 283.898 245.674 326.527C244.226 329.626 243.614 336.364 247.733 338.332C251.852 340.299 256.39 336.077 257.344 333.741C268.328 306.852 300.592 263.567 335.603 264.223C351.341 264.518 356.509 270.109 361.2 275.187C363.059 277.199 364.844 279.13 367.181 280.619C370.614 281.93 373.497 280.225 376.792 276.028C380.087 271.831 379.487 267.405 378.165 264.879ZM331.484 289.8C347.463 290.974 352.766 300.293 353.452 302.261C354.138 304.229 354.138 309.475 352.078 312.755C349.075 317.537 344.527 318.657 341.095 317.345C340.374 317.001 339.748 316.25 338.98 315.33C336.824 312.743 333.553 308.819 323.933 308.819C306.767 308.819 286.863 333.741 282.057 347.513C280.844 350.992 275.879 352.104 273.819 351.448C271.76 350.792 269.014 347.513 272.446 339.644C286.869 306.574 313.636 288.488 331.484 289.8Z"
            fill="rgba(50,47,49,0.40)"
          />
        </svg>
        {/* Divider */}
        <div className="mb-[8px] h-[1px] w-[24px] bg-[rgba(50,47,49,0.18)]" />
        {/* Info lines */}
        <div className="font-['SF_Pro:Regular',sans-serif] font-normal font-width-normal text-[10px] text-[rgba(50,47,49,0.58)] leading-[16px] tracking-[0.02em]">
          <p className="mb-0 font-['SF_Pro:Medium',sans-serif] font-[510] font-width-normal text-[rgba(50,47,49,0.58)] uppercase tracking-[0.06em]">
            Digital Product Passport
          </p>
          <p className="mb-0">
            {data.identity.productIdSystem === "did:web"
              ? "did:web"
              : data.identity.productIdSystem === "gtin"
                ? "GS1 GTIN"
                : "Product Connect"}
          </p>
          <p className="mb-0">ID: {data.identity.productIdValue}</p>
          <p className="mb-0">EU ESPR 2024/1781</p>
        </div>
      </div>
    </div>
  );
}
