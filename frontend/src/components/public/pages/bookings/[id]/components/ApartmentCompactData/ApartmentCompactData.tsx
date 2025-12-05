import type {
  Amenity,
  Apartment,
  ApartmentAmenity,
  ApartmentBed,
  ApartmentImage,
  BedType,
  Review,
} from "@shared/src/database";
import { House, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import default_image from "@/../public/common/no-image.jpeg";
import { Shimmer } from "@/components/styles/ui";
import { getImageUrl } from "@/lib/api/utils/image-url";
import classes from "./ApartmentCompactData.module.scss";

interface ApartmentCompactDataProps {
  apartment?: Apartment & {
    images: ApartmentImage[];
    apartment_amenities: (ApartmentAmenity & { amenity: Amenity })[];
    apartment_beds: (ApartmentBed & { bed_type: BedType })[];
    reviews: Review[];
  };
}

const calculateAverageRating = (reviews: Review[]): number => {
  if (!reviews || reviews.length === 0) return 0;
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  return Math.round((totalRating / reviews.length) * 10) / 10;
};

export const ApartmentCompactData = ({
  apartment,
}: ApartmentCompactDataProps) =>
  !apartment ? (
    <ApartmentCompactDataShimmer />
  ) : (
    <Link href={`/apartments/${apartment.id}`} className={classes.container}>
      <div className={classes.header}>
        <House size={24} />
        <h3>Booked apartment</h3>
      </div>

      {/* Main Image */}
      <Image
        src={getImageUrl(apartment.image) ?? default_image.src}
        alt={apartment.name ?? "Apartment image"}
        width={400}
        height={300}
        className={classes.image}
      />

      {/* Thumbnail Images */}
      {apartment.images && apartment.images.length > 1 && (
        <div className={classes.thumbnails}>
          {apartment.images.slice(1, 5).map((img, index) => (
            <Image
              key={img.id}
              src={getImageUrl(img.image) ?? default_image.src}
              alt={`Apartment image ${index + 2}`}
              width={80}
              height={60}
              className={classes.thumbnail}
            />
          ))}
          {apartment.images.length > 5 && (
            <div className={classes.more_images}>
              +{apartment.images.length - 5}
            </div>
          )}
        </div>
      )}

      <div className={classes.info}>
        <h3 className={classes.basic}>
          {apartment.name}{" "}
          <span className={classes.type}>{apartment.type.toLowerCase()}</span>
        </h3>

        <div className={classes.location_and_rating}>
          <p className={classes.meta}>
            Location:{" "}
            <span>
              Floor {apartment.floor}, Room {apartment.number}
            </span>
          </p>

          {apartment.reviews && apartment.reviews.length > 0 && (
            <div className={classes.rating}>
              <Star size={16} className={classes.star_icon} />
              <span className={classes.rating_value}>
                {calculateAverageRating(apartment.reviews)}
              </span>
              <span className={classes.review_count}>
                ({apartment.reviews.length} review
                {apartment.reviews.length !== 1 ? "s" : ""})
              </span>
            </div>
          )}
        </div>

        <p className={classes.description}>
          {apartment.description?.slice(0, 100)}{" "}
          {apartment.description?.length && apartment.description.length > 100
            ? "..."
            : ""}
        </p>
      </div>

      {/* Amenities */}
      {apartment.apartment_amenities &&
        apartment.apartment_amenities.length > 0 && (
          <div className={classes.amenities}>
            <h4 className={classes.section_title}>Amenities</h4>
            <div className={classes.amenities_grid}>
              {apartment.apartment_amenities.map((apartmentAmenity) => (
                <div
                  key={apartmentAmenity.amenity.id}
                  className={classes.amenity}
                >
                  <Image
                    src={
                      getImageUrl(apartmentAmenity.amenity.image) ??
                      default_image.src
                    }
                    alt={apartmentAmenity.amenity.name}
                    width={16}
                    height={16}
                    className={classes.amenity_icon}
                  />
                  <span className={classes.amenity_name}>
                    {apartmentAmenity.amenity.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Beds */}
      {apartment.apartment_beds && apartment.apartment_beds.length > 0 && (
        <div className={classes.beds}>
          <h4 className={classes.section_title}>Sleeping arrangements</h4>
          <div className={classes.beds_list}>
            {apartment.apartment_beds.map((apartmentBed) => (
              <div key={apartmentBed.id} className={classes.bed_item}>
                <Image
                  src={
                    getImageUrl(apartmentBed.bed_type.image) ??
                    default_image.src
                  }
                  alt={apartmentBed.bed_type.name}
                  width={16}
                  height={16}
                  className={classes.bed_icon}
                />
                <span>
                  {apartmentBed.count}x {apartmentBed.bed_type.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Link>
  );

const ApartmentCompactDataShimmer = () => (
  <div className={classes.container}>
    <div className={classes.header}>
      <Shimmer
        className={classes.shimmer_icon}
        style={{ width: "24px", height: "24px" }}
      />
      <Shimmer
        className={classes.shimmer_title}
        style={{ height: "24px", width: "140px" }}
      />
    </div>

    {/* Main Image */}
    <Shimmer
      className={classes.image}
      style={{ height: "180px", width: "100%" }}
    />

    {/* Thumbnails */}
    <div className={classes.thumbnails}>
      {Array.from({ length: 4 }).map((_, index) => (
        <Shimmer
          key={index}
          className={classes.shimmer_thumbnail}
          style={{ width: "80px", height: "60px" }}
        />
      ))}
      <Shimmer
        className={classes.shimmer_more}
        style={{ width: "80px", height: "60px" }}
      />
    </div>

    <div className={classes.info}>
      <Shimmer
        className={classes.shimmer_basic}
        style={{ height: "20px", width: "200px", marginBottom: "12px" }}
      />

      <div className={classes.location_and_rating}>
        <Shimmer
          className={classes.shimmer_meta}
          style={{ height: "16px", width: "160px" }}
        />
        <div className={classes.rating}>
          <Shimmer
            className={classes.shimmer_star}
            style={{ width: "16px", height: "16px" }}
          />
          <Shimmer
            className={classes.shimmer_rating_value}
            style={{ height: "16px", width: "30px" }}
          />
          <Shimmer
            className={classes.shimmer_review_count}
            style={{ height: "16px", width: "50px" }}
          />
        </div>
      </div>
    </div>

    {/* Amenities */}
    <div className={classes.amenities}>
      <Shimmer
        className={classes.shimmer_section_title}
        style={{ height: "18px", width: "80px", marginBottom: "12px" }}
      />
      <div className={classes.amenities_grid}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className={classes.amenity}>
            <Shimmer
              className={classes.shimmer_amenity_icon}
              style={{ width: "16px", height: "16px" }}
            />
            <Shimmer
              className={classes.shimmer_amenity_name}
              style={{ height: "14px", width: "60px" }}
            />
          </div>
        ))}
      </div>
    </div>

    {/* Beds */}
    <div className={classes.beds}>
      <Shimmer
        className={classes.shimmer_section_title}
        style={{ height: "18px", width: "180px", marginBottom: "12px" }}
      />
      <div className={classes.beds_list}>
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className={classes.bed_item}>
            <Shimmer
              className={classes.shimmer_bed_icon}
              style={{ width: "16px", height: "16px" }}
            />
            <Shimmer
              className={classes.shimmer_bed_text}
              style={{ height: "16px", width: "100px" }}
            />
          </div>
        ))}
      </div>
    </div>
  </div>
);
