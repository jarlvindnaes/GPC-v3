import type React from "react";
import { useEffect, useState } from "react";
import { DppCollapsibleSection } from "./DppCollapsibleSection";
import { certIcons, redListIcons } from "./dppIcons";
import { aivenTable } from "./dppProductData";

const data = aivenTable;

/** Simple inline divider */
function Divider() {
  return <div aria-hidden="true" className="w-full h-px bg-[#d5d5d5] shrink-0" />;
}

function PefcLogo() {
  return (
    <div className="h-[79px] relative shrink-0 w-[66px]" data-name="PEFC_Logo">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 67 80"
        role="img"
        aria-label="PEFC certified sustainable forestry"
      >
        <g clipPath="url(#clip0_11527_15330)">
          <rect x="1" y="1" width="64" height="78" rx="6" fill="white" />
          <path
            d="M61.5997 0C64.3639 0.465753 66.4417 2.6758 67 5.38813V74.7032C66.7712 75.6621 66.5332 76.5571 65.9749 77.379C65.0138 78.8037 63.531 79.6438 61.8743 80H5.12568C2.47131 79.3699 0.530874 77.2694 0 74.6119V5.2968C0.375273 2.66667 2.60861 0.292237 5.30874 0H61.5997ZM5.56503 2.21918C3.70697 2.47489 2.34317 3.92694 2.19672 5.79909V74.1187C2.34317 75.8539 3.9541 77.6621 5.72063 77.8174H61.3801C63.3571 77.5708 64.6751 76.0822 64.8124 74.1187V5.89041C64.6019 4.11872 63.0184 2.34703 61.197 2.19178L5.56503 2.21918Z"
            fill="black"
          />
          <path
            d="M47.2297 27.8539L47.5043 25.6164C47.5043 16.7306 40.2276 12.137 31.8343 13.6347C27.8894 14.3379 24.5119 16.3014 21.5097 18.8584C20.7775 19.4886 20.4297 20.1187 19.3496 20.3653C18.2696 20.6119 19.2032 20.3653 19.2215 20.2374C22.5623 16.3196 27.0839 13.1963 32.0906 11.7991C37.2621 10.347 43.184 10.6575 47.5866 13.9452C51.6597 16.9863 53.4995 22.137 52.8588 27.1324L52.6299 27.0868L50.5797 24.8493L47.2297 27.863V27.8539Z"
            fill="black"
          />
          <path
            d="M50.2501 27.4886L52.3187 29.9635C50.0945 38.0822 42.9918 44.8311 34.9463 47.1507C28.2371 49.0776 20.4113 47.9726 16.2742 41.8995C13.8212 38.2922 13.2445 33.0685 14.5809 28.9406C14.6083 28.8493 14.6083 28.6667 14.7365 28.6849C14.7365 29.242 15.011 29.8265 15.0202 30.3744C15.0294 31.2603 14.8005 32.1827 14.828 33.1142C15.011 38.2283 18.2878 42.5936 23.2304 44C32.594 46.6667 43.1291 39.6986 46.4059 31.0137L50.0213 27.589L50.2501 27.4977V27.4886Z"
            fill="black"
          />
          <path
            d="M24.9879 39.1781H21.1437V34.5206C15.8532 33.0228 14.3247 26.2101 18.6266 22.6484C22.9285 19.0868 32.4568 23.79 29.6743 30.5662C28.823 32.6393 27.0748 33.9635 24.9879 34.6575V39.1781Z"
            fill="black"
          />
          <path
            d="M42.7447 35.0685H37.0699V39.0868H33.3172V35.0685H27.4592C28.2738 34.4749 29.1342 33.927 29.7932 33.1507C31.5232 31.1324 31.9808 28.7215 31.7154 26.1187L35.1478 19.5434L42.7447 35.0685Z"
            fill="black"
          />
          <path
            d="M32.31 51.2329V53.3334H26.7267V54.5206H30.571V56.621H26.7267V57.9909H32.31V60.0914H24.3469V51.2329H32.31Z"
            fill="black"
          />
          <path
            d="M15.8347 57.5343V60.0914H13.455V55.4338H18.8095C18.8827 55.4338 19.1568 55.3824 19.4044 55.1142C19.7248 54.7672 19.7522 54.0548 19.441 53.6987C19.1298 53.3425 18.782 53.3334 18.7088 53.3334H13.4458V51.2329H18.8003C21.4272 51.2329 23.1571 54.3927 21.2716 56.4384C20.1757 57.5343 19.6332 57.5343 18.9834 57.5343H15.8256H15.8347Z"
            fill="black"
          />
          <path
            d="M49.225 51.0685C50.662 51.0411 52.2638 51.6073 53.2615 52.6576C53.2981 52.8585 51.6597 53.8539 51.3943 54.0366C49.6643 52.0731 45.9025 53.7078 46.7079 56.3653C47.5134 59.0229 49.9756 58.7306 51.3943 57.4429L53.2706 58.6758C50.8542 61.379 45.3441 60.5297 44.3098 56.9315C43.3762 53.6987 46.1221 51.1233 49.2342 51.0685H49.225Z"
            fill="black"
          />
          <path
            d="M42.9277 51.2329V53.3334H37.3444V54.5206H41.1886V56.621H37.3444V60.0914H34.9646V51.2329H42.9277Z"
            fill="black"
          />
          <path
            d="M19.8622 65.2968V65.6621H17.757V66.758H19.6791V67.2146H17.757V68.4018H19.9537L19.8164 68.8585H17.2993V65.2968H19.8622Z"
            fill="black"
          />
          <path
            d="M33.317 66.2101C32.7312 66.3288 32.9966 65.7352 32.4383 65.6621C31.88 65.5891 31.5138 66.2831 31.5779 66.8493C33.6373 65.4886 34.1865 69.1598 32.0905 68.8493C30.6718 68.6393 30.8457 65.5799 32.0081 65.3151C33.1705 65.0502 33.3444 65.4612 33.317 66.2101ZM32.7403 68.3744C33.2804 67.9452 32.9051 66.4658 31.9074 67.0411C30.9097 67.6165 31.9166 69.032 32.7403 68.3744Z"
            fill="black"
          />
          <path
            d="M14.4618 67.3973V68.8585H14.0042V65.2968H15.972C16.21 65.2968 16.5853 65.7534 16.6402 66C16.924 67.4155 15.4869 67.4795 14.4618 67.3973ZM14.4618 66.9406C16.7958 67.2877 16.7775 65.3425 14.4618 65.6621V66.9406Z"
            fill="black"
          />
          <path
            d="M26.4523 66.3014L26.0862 66.3562C25.8299 65.7443 25.5187 65.589 24.8506 65.6621C24.1824 65.7352 23.8254 67.0411 24.0451 67.7534C24.3654 68.7854 25.9947 68.7397 26.0862 67.589L26.5439 67.6804C26.5347 68.2101 25.9947 68.7763 25.4821 68.8585C22.8735 69.2694 22.7728 65.3059 25.0336 65.2055C25.656 65.1781 26.4889 65.5982 26.4432 66.3014H26.4523Z"
            fill="black"
          />
          <path
            d="M51.6231 65.7534L51.44 66.6667C52.511 66.1096 53.3713 66.7854 53.1608 67.9726C52.9503 69.1598 50.9092 69.1872 50.8909 67.8539H51.3394C51.5957 69.1142 53.1334 68.4292 52.6482 67.242C52.1631 66.0548 51.5224 67.1507 50.9824 67.1233L51.257 65.2968H52.9503C53.1242 65.2968 53.1242 65.7534 52.9503 65.7534H51.6231Z"
            fill="black"
          />
          <path
            d="M43.2023 68.4019H44.9414V68.8585H42.5616C42.5341 67.9178 44.4379 67.0959 44.4837 66.3379C44.5386 65.3973 42.9918 65.3973 43.1108 66.3927L42.6531 66.3014C42.6256 65.2877 44.1817 64.9224 44.7125 65.6621C45.518 66.7854 43.7606 67.653 43.2023 68.4019Z"
            fill="black"
          />
          <path
            d="M37.1612 66.8493C37.1978 67.0046 37.4358 66.9863 37.5731 67.1233C37.8111 67.3425 37.8385 67.6804 37.7928 67.9909C37.6097 69.2146 35.5503 69.1872 35.5137 67.863L35.953 67.8813C36.0629 68.8493 37.39 68.6758 37.3443 67.7352C37.3168 67.1507 36.8226 67.0228 36.3283 67.1416C36.2642 66.6119 36.9507 66.8128 37.1063 66.5023C37.39 65.9178 36.9598 65.5982 36.3924 65.6986C35.8249 65.7991 36.1361 66.0822 35.9622 66.1827C35.4496 66.4932 35.4679 65.7808 35.9896 65.4795C37.1154 64.8219 38.3511 66.1827 37.1521 66.8676L37.1612 66.8493Z"
            fill="black"
          />
          <path
            d="M47.0465 66.8493C47.0831 67.0046 47.3211 66.9863 47.4584 67.1233C47.6963 67.3425 47.7238 67.6804 47.678 67.9909C47.495 69.2146 45.4355 69.1872 45.3989 67.863L45.8383 67.8813C45.9481 68.8493 47.2753 68.6758 47.2295 67.7352C47.2021 67.1507 46.7078 67.0228 46.2135 67.1416C46.1495 66.6119 46.8359 66.8128 46.9916 66.5023C47.2753 65.9178 46.8451 65.5982 46.2776 65.6986C45.7101 65.7991 46.0213 66.0822 45.8474 66.1827C45.3349 66.4932 45.3532 65.7808 45.8749 65.4795C47.0007 64.8219 48.2364 66.1827 47.0373 66.8676L47.0465 66.8493Z"
            fill="black"
          />
          <path
            d="M22.974 65.2968V65.6621H21.0519V66.758H22.6994V67.2146H21.0519V68.8585H20.5942V65.2968H22.974Z"
            fill="black"
          />
          <path
            d="M40.5478 65.2968C40.6393 65.7717 40.2366 65.9817 40.0169 66.3653C39.5684 67.169 39.3121 67.9361 39.1657 68.8493L38.8087 68.8676C38.7721 68.1827 39.0101 67.3881 39.3121 66.7671C39.6142 66.1461 39.7698 66.1187 39.9071 65.7626H38.2595V65.3059H40.5478V65.2968Z"
            fill="black"
          />
          <path
            d="M50.433 65.2968C50.5246 65.7717 50.1218 65.9817 49.9022 66.3653C49.4537 67.169 49.1974 67.9361 49.0509 68.8493L48.694 68.8676C48.6573 68.1827 48.8953 67.3881 49.1974 66.7671C49.4994 66.1461 49.655 66.1187 49.7923 65.7626H48.1448V65.3059H50.433V65.2968Z"
            fill="black"
          />
          <path
            d="M30.0218 65.2968V68.8585H29.5641V66.1187L28.7861 66.5753C28.6305 66.6027 28.6397 66.5753 28.6488 66.4384C28.6672 66.0274 29.0241 66.0365 29.2987 65.7991C29.5733 65.5616 29.6191 65.1964 30.031 65.2968H30.0218Z"
            fill="black"
          />
          <path d="M28.0998 65.2968L27.1753 68.9407L26.8184 68.9498L27.7428 65.3059L28.0998 65.2968Z" fill="black" />
          <path d="M35.1476 67.306H33.7747V67.7626H35.1476V67.306Z" fill="black" />
          <path d="M42.287 67.306H40.9141V67.7626H42.287V67.306Z" fill="black" />
        </g>
        <defs>
          <clipPath id="clip0_11527_15330">
            <rect width="67" height="80" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Chart() {
  return (
    <figure
      className="relative shrink-0 size-[150px] m-0"
      data-name="chart"
      aria-label="Material distribution donut chart"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 150 150"
        role="img"
        aria-label="Material distribution: 85% solid timber, 10% metal, 5% other"
      >
        <g clipPath="url(#clip0_dpp_impact_21291)" id="chart">
          <path d={certIcons.p2edeb900} fill="var(--fill-0, #B6D4FC)" id="segment 3" />
          <path d={certIcons.p3489ab00} fill="var(--fill-0, #A9F1FA)" id="segment 2" />
          <path d={certIcons.p151bd000} fill="var(--fill-0, #ADF5D1)" id="segment 1" />
        </g>
        <defs>
          <clipPath id="clip0_dpp_impact_21291">
            <rect fill="white" height="150" width="150" />
          </clipPath>
        </defs>
      </svg>
    </figure>
  );
}

function Chart1() {
  return (
    <figure className="relative shrink-0 size-[150px] m-0" data-name="chart" aria-label="Carbon footprint donut chart">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 150 150"
        role="img"
        aria-label="Carbon footprint by stage: 45% raw materials, 35% manufacturing, 20% transport"
      >
        <g clipPath="url(#clip0_dpp_impact_57130)" id="chart">
          <path d={certIcons.p397db570} fill="var(--fill-0, #B6D4FC)" id="segment 3" />
          <path d={certIcons.p363b280} fill="var(--fill-0, #A9F1FA)" id="segment 2" />
          <path d={certIcons.p182b6f40} fill="var(--fill-0, #ADF5D1)" id="segment 1" />
        </g>
        <defs>
          <clipPath id="clip0_dpp_impact_57130">
            <rect fill="white" height="150" width="150" />
          </clipPath>
        </defs>
      </svg>
    </figure>
  );
}

function Chart2() {
  return (
    <figure
      className="h-[75px] relative shrink-0 w-[150px] m-0"
      data-name="chart"
      aria-label="Recyclability gauge chart"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 150 75"
        role="img"
        aria-label="95% recyclable content, 5% non-recyclable"
      >
        <g clipPath="url(#clip0_dpp_impact_57126)" id="chart">
          <path d={certIcons.p29a1c500} fill="var(--fill-0, #B5F7D5)" id="segment 2" />
          <path d={certIcons.p30413180} fill="var(--fill-0, #FCBFBF)" id="segment 1" />
        </g>
        <defs>
          <clipPath id="clip0_dpp_impact_57126">
            <rect fill="white" height="75" width="150" />
          </clipPath>
        </defs>
      </svg>
    </figure>
  );
}

function EcoLabel() {
  return (
    <div className="relative shrink-0 size-[80px]" data-name="EcoLabel">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 80 80"
        role="img"
        aria-label="EU Ecolabel certified"
      >
        <g id="EcoLabel">
          <path d={certIcons.p3465ec00} fill="var(--fill-0, white)" id="Vector" />
          <path d={certIcons.p17cafb80} fill="var(--fill-0, #2B689D)" id="Vector_2" />
          <g id="Union">
            <path d={certIcons.p29504bf0} fill="var(--fill-0, #2B689D)" />
            <path d={certIcons.p1faa1e00} fill="var(--fill-0, #2B689D)" />
            <path d={certIcons.p52b0a80} fill="var(--fill-0, #2B689D)" />
            <path d={certIcons.p23b48400} fill="var(--fill-0, #2B689D)" />
            <path d={certIcons.p3c1a2700} fill="var(--fill-0, #2B689D)" />
            <path d={certIcons.p9e98580} fill="var(--fill-0, #2B689D)" />
            <path d={certIcons.p14091b40} fill="var(--fill-0, #2B689D)" />
            <path d={certIcons.p3f266500} fill="var(--fill-0, #2B689D)" />
            <path d={certIcons.pf0a1d00} fill="var(--fill-0, #2B689D)" />
            <path d={certIcons.p114c36f0} fill="var(--fill-0, #2B689D)" />
            <path d={certIcons.p24adde00} fill="var(--fill-0, #2B689D)" />
            <path d={certIcons.p24c93e80} fill="var(--fill-0, #2B689D)" />
          </g>
          <g id="Group 20">
            <path d={certIcons.p4860580} id="Vector_3" stroke="var(--stroke-0, #53AE47)" strokeWidth="0.13" />
            <path d={certIcons.p709db00} id="Vector_4" stroke="var(--stroke-0, #53AE47)" strokeWidth="0.13" />
            <path d={certIcons.p46a2700} id="Vector_5" stroke="var(--stroke-0, #53AE47)" strokeWidth="0.13" />
            <path d={certIcons.p269437f2} id="Vector_6" stroke="var(--stroke-0, #53AE47)" strokeWidth="0.13" />
            <path d={certIcons.p276fe70} id="Vector_7" stroke="var(--stroke-0, #53AE47)" strokeWidth="0.13" />
            <path d={certIcons.p2e5f100} fill="var(--fill-0, #53AE47)" id="Vector_8" />
            <path d={certIcons.p3e23f400} id="Vector_9" stroke="var(--stroke-0, #53AE47)" strokeWidth="0.13" />
            <path d={certIcons.p3ae744f0} id="Vector_10" stroke="var(--stroke-0, #53AE47)" strokeWidth="0.13" />
            <path d={certIcons.p37c77600} id="Vector_11" stroke="var(--stroke-0, #53AE47)" strokeWidth="0.13" />
            <path d={certIcons.p2064a000} id="Vector_12" stroke="var(--stroke-0, #53AE47)" strokeWidth="0.13" />
            <path d={certIcons.p38ea8580} id="Vector_13" stroke="var(--stroke-0, #53AE47)" strokeWidth="0.13" />
            <path d={certIcons.p17da8200} id="Vector_14" stroke="var(--stroke-0, #53AE47)" strokeWidth="0.13" />
            <path d={certIcons.p1da6180} id="Vector_15" stroke="var(--stroke-0, #53AE47)" strokeWidth="0.13" />
            <path d={certIcons.p13fb3f00} id="Vector_16" stroke="var(--stroke-0, #53AE47)" strokeWidth="0.13" />
            <path d={certIcons.pd63f300} id="Vector_17" stroke="var(--stroke-0, #53AE47)" strokeWidth="0.13" />
            <path d={certIcons.p4860580} fill="var(--fill-0, #53AE47)" id="Vector_18" />
            <path d={certIcons.p709db00} fill="var(--fill-0, #53AE47)" id="Vector_19" />
            <path d={certIcons.p46a2700} fill="var(--fill-0, #53AE47)" id="Vector_20" />
            <path d={certIcons.p269437f2} fill="var(--fill-0, #53AE47)" id="Vector_21" />
            <path d={certIcons.p276fe70} fill="var(--fill-0, #53AE47)" id="Vector_22" />
            <path d={certIcons.p2c199980} id="Vector_23" stroke="var(--stroke-0, #53AE47)" strokeWidth="0.13" />
            <path d={certIcons.p1ab04f00} fill="var(--fill-0, #53AE47)" id="Vector_24" />
            <path d={certIcons.p3ae744f0} fill="var(--fill-0, #53AE47)" id="Vector_25" />
            <path d={certIcons.p37c77600} fill="var(--fill-0, #53AE47)" id="Vector_26" />
            <path d={certIcons.p25e91500} fill="var(--fill-0, #53AE47)" id="Vector_27" />
            <path d={certIcons.p38ea8580} fill="var(--fill-0, #53AE47)" id="Vector_28" />
            <path d={certIcons.p17da8200} fill="var(--fill-0, #53AE47)" id="Vector_29" />
            <path d={certIcons.p1da6180} fill="var(--fill-0, #53AE47)" id="Vector_30" />
            <path d={certIcons.p13fb3f00} fill="var(--fill-0, #53AE47)" id="Vector_31" />
            <path d={certIcons.pd63f300} fill="var(--fill-0, #53AE47)" id="Vector_32" />
          </g>
          <g id="Union_2">
            <path d={certIcons.p23dd8580} fill="var(--fill-0, #53AE47)" />
            <path d={certIcons.pf385af2} fill="var(--fill-0, #53AE47)" />
            <path d={certIcons.p667fe00} fill="var(--fill-0, #53AE47)" />
            <path d={certIcons.p6eb4000} fill="var(--fill-0, #53AE47)" />
            <path d={certIcons.p150da800} fill="var(--fill-0, #53AE47)" />
            <path d={certIcons.p26d5d600} fill="var(--fill-0, #53AE47)" />
            <path d={certIcons.p36a76700} fill="var(--fill-0, #53AE47)" />
            <path d={certIcons.pa789500} fill="var(--fill-0, #53AE47)" />
          </g>
          <g id="Union_3">
            <path d={certIcons.p3214c280} fill="var(--fill-0, #2B689D)" />
            <path d={certIcons.p2eea9640} fill="var(--fill-0, #2B689D)" />
            <path clipRule="evenodd" d={certIcons.p3b0dc00} fill="var(--fill-0, #2B689D)" fillRule="evenodd" />
            <path d={certIcons.pd4effb0} fill="var(--fill-0, #2B689D)" />
            <path clipRule="evenodd" d={certIcons.p2f188d00} fill="var(--fill-0, #2B689D)" fillRule="evenodd" />
            <path clipRule="evenodd" d={certIcons.p24984f00} fill="var(--fill-0, #2B689D)" fillRule="evenodd" />
            <path clipRule="evenodd" d={certIcons.p261f0cf0} fill="var(--fill-0, #2B689D)" fillRule="evenodd" />
            <path d={certIcons.p3e4f0b30} fill="var(--fill-0, #2B689D)" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function RedListLogo() {
  return (
    <div className="relative shrink-0 size-[80px]" data-name="Red List">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 80 80"
        role="img"
        aria-label="International Living Future Institute — Red List Free"
      >
        <g clipPath="url(#clip0_dpp_impact_14988)">
          <path d={redListIcons.d1} fill="#EE4D24" />
          <path d={redListIcons.d2} fill="#F37E71" />
          <path d={redListIcons.d3} fill="#F37E71" />
          <path d={redListIcons.d4} fill="#F37E71" />
          <path d={redListIcons.d5} fill="#F26F58" />
          <path d={redListIcons.redListFreeText} fill="white" />
          <path d={redListIcons.edText} fill="white" />
          <path d={redListIcons.dText} fill="white" />
          <path d={redListIcons.lText} fill="white" />
          <path d={redListIcons.iText} fill="white" />
          <path d={redListIcons.sText} fill="white" />
          <path d={redListIcons.tText} fill="white" />
          <path d={redListIcons.freeText} fill="white" />
          <path d={redListIcons.internationalText} fill="black" />
          <path d={redListIcons.livingText} fill="black" />
          <path d={redListIcons.futureText} fill="black" />
          <path d={redListIcons.instituteText} fill="black" />
        </g>
        <defs>
          <clipPath id="clip0_dpp_impact_14988">
            <rect width="80" height="80" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function EpDverified() {
  return (
    <div className="relative shrink-0 size-[80px]" data-name="EPDverified">
      <div className="absolute inset-[-40%_-49.96%_-59.96%_-50%]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 160 160"
          role="img"
          aria-label="EPD Verified — Environmental Product Declaration"
        >
          <g clipPath="url(#clip0_dpp_impact_21244)" filter="url(#filter0_dd_dpp_impact_21244)" id="EPDverified">
            <path d={certIcons.p204ab580} fill="var(--fill-0, #62B345)" id="Union" />
            <g id="Union_2">
              <path d={certIcons.p22e70c00} fill="var(--fill-0, white)" />
              <path d={certIcons.p24620b80} fill="var(--fill-0, white)" />
            </g>
            <g id="Text">
              <path clipRule="evenodd" d={certIcons.p3177d100} fill="var(--fill-0, #62B345)" fillRule="evenodd" />
              <path clipRule="evenodd" d={certIcons.p19322900} fill="var(--fill-0, #62B345)" fillRule="evenodd" />
              <path d={certIcons.p1f81b80} fill="var(--fill-0, #62B345)" />
              <path d={certIcons.p22fc47c0} fill="var(--fill-0, #62B345)" />
              <path clipRule="evenodd" d={certIcons.p30dcb500} fill="var(--fill-0, #62B345)" fillRule="evenodd" />
              <path d={certIcons.p193d5000} fill="var(--fill-0, #62B345)" />
              <path d={certIcons.pf59a280} fill="var(--fill-0, #62B345)" />
              <path clipRule="evenodd" d={certIcons.p338f5e80} fill="var(--fill-0, #62B345)" fillRule="evenodd" />
              <path d={certIcons.p29264670} fill="var(--fill-0, #62B345)" />
              <path d={certIcons.pe4b4c00} fill="var(--fill-0, #62B345)" />
              <path clipRule="evenodd" d={certIcons.p19608080} fill="var(--fill-0, #62B345)" fillRule="evenodd" />
              <path clipRule="evenodd" d={certIcons.p19f58900} fill="var(--fill-0, #62B345)" fillRule="evenodd" />
              <path d={certIcons.pa0a0e80} fill="var(--fill-0, #62B345)" />
            </g>
          </g>
          <defs>
            <filter
              colorInterpolationFilters="sRGB"
              filterUnits="userSpaceOnUse"
              height="160"
              id="filter0_dd_dpp_impact_21244"
              width="160"
              x="0"
              y="0"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                result="hardAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              />
              <feOffset dy="8" />
              <feGaussianBlur stdDeviation="20" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.012 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow" />
              <feColorMatrix
                in="SourceAlpha"
                result="hardAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              />
              <feMorphology in="SourceAlpha" operator="erode" radius="16" result="effect2_dropShadow" />
              <feOffset dy="12" />
              <feGaussianBlur stdDeviation="16" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.000348066 0 0 0 0 0.000348066 0 0 0 0 0.231652 0 0 0 0.051 0"
              />
              <feBlend in2="effect1_dropShadow" mode="normal" result="effect2_dropShadow" />
              <feBlend in="SourceGraphic" in2="effect2_dropShadow" mode="normal" result="shape" />
            </filter>
            <clipPath id="clip0_dpp_impact_21244">
              <rect fill="white" height="80" transform="translate(40 32)" width="80" />
            </clipPath>
          </defs>
        </svg>
      </div>
    </div>
  );
}

interface DppImpactViewProps {
  scrollRef?: React.RefObject<HTMLDivElement | null>;
}

export default function DppImpactView({ scrollRef }: DppImpactViewProps) {
  const [materialDistributionOpen, setMaterialDistributionOpen] = useState(true);
  const [carbonFootprintOpen, setCarbonFootprintOpen] = useState(false);
  const [toxicityOpen, setToxicityOpen] = useState(false);
  const [recyclabilityOpen, setRecyclabilityOpen] = useState(false);
  const [certificationsOpen, setCertificationsOpen] = useState(true);

  useEffect(() => {
    if (scrollRef?.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [scrollRef]);

  return (
    <div className="relative w-full pb-[80px] pt-[50px]">
      {/* Title Section */}
      <div className="relative shrink-0 w-full">
        <div className="flex flex-row items-end overflow-clip rounded-[inherit] size-full">
          <div className="box-border content-stretch flex items-end pb-[40px] pl-0 pr-[20px] pt-[10px] relative w-full">
            <div className="basis-0 grow min-h-px min-w-px relative shrink-0" data-name="Title">
              <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
                <div className="box-border content-stretch flex items-center px-[16px] py-[10px] relative w-full">
                  <div className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[16px] text-[rgba(0,4,24,0.58)] text-nowrap whitespace-pre font-width-normal">
                    <h1 className="font-['SF_Pro:Medium',sans-serif] font-[510] mb-0 text-[rgba(0,7,19,0.62)] font-width-normal">
                      {data.categorization.displayName}
                    </h1>
                    <p>{`Designed by ${data.categorization.designer}`}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Divider />

      {/* Material Distribution Section */}
      <DppCollapsibleSection
        title="Material distribution"
        isOpen={materialDistributionOpen}
        onToggle={() => setMaterialDistributionOpen(!materialDistributionOpen)}
      >
        <div
          className="box-border content-stretch flex flex-col gap-[8px] items-center overflow-clip px-0 py-[8px] relative shrink-0 w-full"
          data-name="Graph"
        >
          <div className="relative shrink-0 w-full" data-name="Chart-Parts">
            <div className="flex flex-col items-center size-full">
              <div className="box-border content-stretch flex flex-col gap-[24px] items-center p-[12px] relative w-full">
                <div
                  className="bg-[rgba(255,255,255,0)] content-stretch flex items-start relative shrink-0 w-full"
                  data-name="Heading"
                >
                  <h3 className="basis-0 font-['SF_Pro:Bold',sans-serif] font-bold grow leading-[20px] min-h-px min-w-px relative shrink-0 text-[#1c2024] text-[14px] text-center font-width-normal">
                    What it's made from
                  </h3>
                </div>
                <Chart />
                <div
                  className="content-center flex flex-wrap gap-[13px] items-center justify-between relative shrink-0 w-full"
                  data-name="Part types"
                >
                  {data.materialsAndComponents.materialComposition.map((mat) => (
                    <div key={mat.material} className="content-stretch flex gap-[8px] items-center relative shrink-0">
                      <div className="rounded-[3px] shrink-0 size-[16px]" style={{ backgroundColor: mat.chartColor }} />
                      <p className="font-['SF_Pro:Light',sans-serif] font-[274.315] leading-[16px] relative shrink-0 text-[12px] text-[rgba(0,7,19,0.62)] text-nowrap tracking-[0.04px] whitespace-pre font-width-normal">
                        {`${mat.label} ${mat.percentage}%`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip pb-[20px] pt-[8px] px-0 relative shrink-0 w-full"
          data-name="Sub Info"
        >
          <p className="basis-0 font-['SF_Pro:Light',sans-serif] font-[274.315] grow leading-[24px] min-h-px min-w-px relative shrink-0 text-[0px] text-[14px] text-[rgba(0,7,19,0.62)] text-right whitespace-pre-wrap font-width-normal">
            <span className="font-['SF_Pro:Semibold',sans-serif] font-[590] font-width-normal">{`${data.materialsAndComponents.totalWeight.value} `}</span>
            <span>{" kilograms"}</span>
          </p>
        </div>

        <div className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[14px] text-[rgba(0,7,19,0.62)] w-full px-[16px] pb-[20px] font-width-normal">
          {data.materialsAndComponents.materialDescriptions.map((mat) => (
            <p key={mat.material} className="mb-4">
              <span className="font-['SF_Pro:Semibold',sans-serif] font-[590] font-width-normal">
                {mat.description ? `${mat.material}:` : mat.material}
              </span>
              {mat.description && ` ${mat.description}`}
            </p>
          ))}
          {data.materialsAndComponents.adhesive && (
            <p className="mb-4">
              <span className="font-['SF_Pro:Semibold',sans-serif] font-[590] font-width-normal">Adhesive:</span>
              {` ${data.materialsAndComponents.adhesive}`}
            </p>
          )}
          {data.materialsAndComponents.fasteners && (
            <p className="mb-4">
              <span className="font-['SF_Pro:Semibold',sans-serif] font-[590] font-width-normal">Fasteners:</span>
              {` ${data.materialsAndComponents.fasteners}`}
            </p>
          )}
          <p className="mb-4">
            <span className="font-['SF_Pro:Semibold',sans-serif] font-[590] font-width-normal">Packaging:</span>
            {` ${data.materialsAndComponents.packaging.summary}`}
          </p>
          <p className="mb-4">{data.materialsAndComponents.packaging.domestic}</p>
          <p className="mb-0">{data.materialsAndComponents.packaging.international}</p>
        </div>
      </DppCollapsibleSection>

      <Divider />

      {/* Carbon Footprint Section */}
      <DppCollapsibleSection
        title="Carbon footprint"
        isOpen={carbonFootprintOpen}
        onToggle={() => setCarbonFootprintOpen(!carbonFootprintOpen)}
      >
        <div
          className="box-border content-stretch flex flex-col gap-[8px] items-center overflow-clip px-0 py-[8px] relative shrink-0 w-full"
          data-name="Graph"
        >
          <div className="relative shrink-0 w-full" data-name="Chart-Parts">
            <div className="flex flex-col items-center size-full">
              <div className="box-border content-stretch flex flex-col gap-[24px] items-center p-[12px] relative w-full">
                <div
                  className="bg-[rgba(255,255,255,0)] content-stretch flex items-start relative shrink-0 w-full"
                  data-name="Heading"
                >
                  <h3 className="basis-0 font-['SF_Pro:Bold',sans-serif] font-bold grow leading-[20px] min-h-px min-w-px relative shrink-0 text-[#1c2024] text-[14px] text-center font-width-normal">
                    Where emissions come from
                  </h3>
                </div>
                <Chart1 />
                <div
                  className="content-center flex flex-wrap gap-[13px] items-center justify-between relative shrink-0 w-full"
                  data-name="Part types"
                >
                  {data.sustainabilityAndImpact.carbonFootprintByStage.map((stage) => (
                    <div key={stage.stage} className="content-stretch flex gap-[8px] items-center relative shrink-0">
                      <div
                        className="rounded-[3px] shrink-0 size-[16px]"
                        style={{ backgroundColor: stage.chartColor }}
                      />
                      <p className="font-['SF_Pro:Light',sans-serif] font-[274.315] leading-[16px] relative shrink-0 text-[12px] text-[rgba(0,7,19,0.62)] text-nowrap tracking-[0.04px] whitespace-pre font-width-normal">
                        {`${stage.label} ${stage.percentage}%`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="box-border content-stretch flex flex-col gap-[4px] items-end overflow-clip pb-[20px] pt-[8px] px-[12px] relative shrink-0 w-full"
          data-name="Sub Info"
        >
          <p className="font-['SF_Pro:Light',sans-serif] font-[274.315] leading-[24px] relative shrink-0 text-[14px] text-[rgba(0,7,19,0.62)] text-right font-width-normal">
            <span className="font-['SF_Pro:Semibold',sans-serif] font-[590] text-[14px] font-width-normal">
              {data.sustainabilityAndImpact.carbonFootprintTotal.value}
            </span>
            <span className="text-[14px]">{" kg CO"}</span>
            <span className="text-[11px]">2</span>
            <span className="text-[16px]"> </span>
            <span className="text-[14px]">equivalent</span>
          </p>
          {data.sustainabilityAndImpact.carbonFootprintScope && (
            <p className="font-['SF_Pro:Light',sans-serif] font-[274.315] leading-[16px] relative shrink-0 text-[12px] text-[rgba(0,7,19,0.58)] text-right font-width-normal">
              {`Scope: ${data.sustainabilityAndImpact.carbonFootprintScope}`}
            </p>
          )}
        </div>
      </DppCollapsibleSection>

      <Divider />

      {/* Toxicity Section */}
      <DppCollapsibleSection title="Toxicity" isOpen={toxicityOpen} onToggle={() => setToxicityOpen(!toxicityOpen)}>
        <div className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[14px] text-[rgba(0,7,19,0.62)] w-full px-[16px] pb-[20px] font-width-normal">
          <p className="mb-4">
            <span className="font-['SF_Pro:Semibold',sans-serif] font-[590] font-width-normal">VOC emissions:</span>
            {` ${data.sustainabilityAndImpact.vocData}`}
          </p>
          <p className="mb-0">
            <span className="font-['SF_Pro:Semibold',sans-serif] font-[590] font-width-normal">Red List Free:</span>
            {` ${data.sustainabilityAndImpact.redListFreeStatement}`}
          </p>
        </div>
      </DppCollapsibleSection>

      <Divider />

      {/* Recyclability & Circularity Section */}
      <DppCollapsibleSection
        title="Recyclability & Circularity"
        isOpen={recyclabilityOpen}
        onToggle={() => setRecyclabilityOpen(!recyclabilityOpen)}
      >
        <div className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[14px] text-[rgba(0,7,19,0.62)] w-full px-[16px] pb-[20px] font-width-normal">
          {/* Key circularity metrics */}
          <div className="flex gap-[12px] mb-6">
            {data.sustainabilityAndImpact.recyclableContentPercent != null && (
              <div className="flex-1 bg-[rgba(173,245,209,0.18)] border border-[rgba(173,245,209,0.50)] rounded-[8px] p-[12px] text-center">
                <p className="font-['SF_Pro:Bold',sans-serif] font-bold text-[24px] text-[#2D7A4F] mb-0 leading-[28px] font-width-normal">
                  {`${data.sustainabilityAndImpact.recyclableContentPercent}%`}
                </p>
                <p className="text-[12px] text-[rgba(0,7,19,0.58)] mb-0 leading-[16px]">Recyclable</p>
              </div>
            )}
            {data.sustainabilityAndImpact.recycledContentPercent != null && (
              <div className="flex-1 bg-[rgba(182,212,252,0.22)] border border-[rgba(182,212,252,0.55)] rounded-[8px] p-[12px] text-center">
                <p className="font-['SF_Pro:Bold',sans-serif] font-bold text-[24px] text-[#3560A0] mb-0 leading-[28px] font-width-normal">
                  {`${data.sustainabilityAndImpact.recycledContentPercent}%`}
                </p>
                <p className="text-[12px] text-[rgba(0,7,19,0.58)] mb-0 leading-[16px]">Recycled content</p>
              </div>
            )}
          </div>

          {data.sustainabilityAndImpact.recyclabilityAssessment && (
            <p className="mb-4">{data.sustainabilityAndImpact.recyclabilityAssessment}</p>
          )}

          {data.sustainabilityAndImpact.substancesOfConcern && (
            <p className="mb-0">
              <span className="font-['SF_Pro:Semibold',sans-serif] font-[590] font-width-normal">
                Substances of concern (REACH):
              </span>
              {` ${data.sustainabilityAndImpact.substancesOfConcern}`}
            </p>
          )}
        </div>
      </DppCollapsibleSection>

      <Divider />

      {/* Certifications Section */}
      <DppCollapsibleSection
        title="Certifications"
        isOpen={certificationsOpen}
        onToggle={() => setCertificationsOpen(!certificationsOpen)}
      >
        <div className="relative shrink-0 w-full pb-[16px] px-[16px]" data-name="content">
          {data.certificationsAndCompliance.buildingRatingContributions && (
            <p className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[24px] text-[14px] text-[rgba(0,7,19,0.62)] mb-4 font-width-normal">
              {data.certificationsAndCompliance.buildingRatingContributions}
            </p>
          )}
          <div className="flex flex-col gap-[10px]">
            {data.certificationsAndCompliance.certifications.map((cert) => (
              <div
                key={cert.name}
                className="bg-[rgba(0,0,0,0.02)] border border-[rgba(0,0,0,0.05)] rounded-[8px] p-[12px]"
              >
                <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] text-[14px] text-[rgba(0,7,19,0.72)] leading-[20px] mb-[2px] font-width-normal">
                  {cert.name}
                </p>
                {cert.issuingBody && (
                  <p className="font-['SF_Pro:Light',sans-serif] font-[274.315] text-[11px] text-[rgba(0,7,19,0.58)] leading-[14px] mb-[6px] font-width-normal">
                    {cert.issuingBody}
                  </p>
                )}
                <p className="font-['SF_Pro:Regular',sans-serif] font-normal text-[13px] text-[rgba(0,7,19,0.56)] leading-[20px] mb-0 font-width-normal">
                  {cert.description}
                </p>
              </div>
            ))}
          </div>

          {/* Additional ESPR-required compliance data */}
          <div className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[22px] text-[13px] text-[rgba(0,7,19,0.58)] mt-[14px] font-width-normal">
            {data.sustainabilityAndImpact.epdReference && (
              <p className="mb-[6px]">
                <span className="font-['SF_Pro:Medium',sans-serif] font-[510] text-[rgba(0,7,19,0.62)] font-width-normal">
                  EPD reference:{" "}
                </span>
                {data.sustainabilityAndImpact.epdReference}
                {data.sustainabilityAndImpact.lcaMethodology && (
                  <span className="text-[rgba(0,7,19,0.58)]">{` (${data.sustainabilityAndImpact.lcaMethodology})`}</span>
                )}
              </p>
            )}
            {data.certificationsAndCompliance.fireSafety && (
              <p className="mb-[6px]">
                <span className="font-['SF_Pro:Medium',sans-serif] font-[510] text-[rgba(0,7,19,0.62)] font-width-normal">
                  Fire safety:{" "}
                </span>
                {data.certificationsAndCompliance.fireSafety}
              </p>
            )}
            {data.certificationsAndCompliance.indoorAirQuality && (
              <p className="mb-0">
                <span className="font-['SF_Pro:Medium',sans-serif] font-[510] text-[rgba(0,7,19,0.62)] font-width-normal">
                  Indoor air quality:{" "}
                </span>
                {data.certificationsAndCompliance.indoorAirQuality}
              </p>
            )}
          </div>
        </div>

        <div className="relative shrink-0 w-full" data-name="Logos">
          <div className="box-border content-stretch flex items-start justify-between overflow-clip pb-[20px] pt-[30px] px-0 relative rounded-[inherit] w-full">
            <PefcLogo />
            <RedListLogo />
            <EpDverified />
          </div>
          <div
            aria-hidden="true"
            className="absolute border-[#d5d5d5] border-[1px_0px_0px] border-solid inset-0 pointer-events-none"
          />
        </div>
      </DppCollapsibleSection>

      {/* Image 3 */}
      <div className="aspect-[289/192] relative shrink-0 w-full" data-name="image 3">
        <img
          alt={`${data.materialsAndComponents.primaryMaterial} — sustainably sourced material`}
          className="absolute inset-0 max-w-none object-center object-cover pointer-events-none size-full"
          src={data.commerce.photographs.materialSource}
        />
      </div>
    </div>
  );
}
