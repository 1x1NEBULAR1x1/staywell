'use client';

import { useEffect, useCallback } from 'react';
import classes from './Recomendations.module.scss';
import { useInfinityApartments } from '@/hooks/public/apartments';
import { useHomePageStore } from '@/stores/public/pages/home/useHomePageStore';
import { Shimmer } from '@/components/styles/ui';
import Link from 'next/link';
import { getTypeDisplayName, getTypeImage, ApartmentCard } from './components';


export const Recomendations = () => {
  const { filters, setIsApartmentsLoading } = useHomePageStore();

  const {
    apartments,
    isLoading,
    loadMore,
    hasNextPage,
    isFetchingNextPage
  } = useInfinityApartments({
    ...filters,
    take: 12,
    is_available: true, // Показываем только доступные квартиры
  });

  useEffect(() => {
    setIsApartmentsLoading(isLoading);
  }, [isLoading, setIsApartmentsLoading]);

  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || isFetchingNextPage) {
      return;
    }
    if (hasNextPage) {
      loadMore();
    }
  }, [hasNextPage, isFetchingNextPage, loadMore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Берем первые 5 квартир для отображения в рекомендациях
  const featuredApartments = apartments.slice(0, 5);

  if (isLoading && apartments.length === 0) return <RecomendationsShimmer />

  return (
    <section className={classes.section_recommendations}>
      <p className={classes.title}>Most Picked</p>

      <div className={classes.images_container}>
        {featuredApartments[0] && (
          <div className={classes.left_image}>
            <Link className={classes.image} href={`/apartments/${featuredApartments[0].id}`}>
              <div className={classes.badge}>
                ${featuredApartments[0].booking_variants?.[0]?.price || 'N/A'}
                <p className={classes.pernight}>per night</p>
              </div>
              <div className={classes.room_title}>
                {getTypeDisplayName(featuredApartments[0].type)}
              </div>
              <img
                src={featuredApartments[0].image || getTypeImage(featuredApartments[0].type)}
                alt={getTypeDisplayName(featuredApartments[0].type)}
              />
            </Link>
          </div>
        )}

        <div className={classes.images}>
          {featuredApartments[1] && (
            <Link className={classes.image} href={`/apartments/${featuredApartments[1].id}`}>
              <div className={classes.badge}>
                ${featuredApartments[1].booking_variants?.[0]?.price || 'N/A'}
                <p className={classes.pernight}>per night</p>
              </div>
              <div className={classes.room_title}>
                {getTypeDisplayName(featuredApartments[1].type)}
              </div>
              <img
                src={featuredApartments[1].image || getTypeImage(featuredApartments[1].type)}
                alt={getTypeDisplayName(featuredApartments[1].type)}
              />
            </Link>
          )}

          {featuredApartments[2] && (
            <Link className={classes.image} href={`/apartments/${featuredApartments[2].id}`}>
              <div className={classes.badge}>
                ${featuredApartments[2].booking_variants?.[0]?.price || 'N/A'}
                <p className={classes.pernight}>per night</p>
              </div>
              <div className={classes.room_title}>
                {getTypeDisplayName(featuredApartments[2].type)}
              </div>
              <img
                src={featuredApartments[2].image || getTypeImage(featuredApartments[2].type)}
                alt={getTypeDisplayName(featuredApartments[2].type)}
              />
            </Link>
          )}
        </div>

        <div className={classes.images}>
          {featuredApartments[3] && (
            <Link className={classes.image} href={`/apartments/${featuredApartments[3].id}`}>
              <div className={classes.badge}>
                ${featuredApartments[3].booking_variants?.[0]?.price || 'N/A'}
                <p className={classes.pernight}>per night</p>
              </div>
              <div className={classes.room_title}>
                {getTypeDisplayName(featuredApartments[3].type)}
              </div>
              <img
                src={featuredApartments[3].image || getTypeImage(featuredApartments[3].type)}
                alt={getTypeDisplayName(featuredApartments[3].type)}
              />
            </Link>
          )}

          {featuredApartments[4] && (
            <Link className={classes.image} href={`/apartments/${featuredApartments[4].id}`}>
              <div className={classes.badge}>
                ${featuredApartments[4].booking_variants?.[0]?.price || 'N/A'}
                <p className={classes.pernight}>per night</p>
              </div>
              <div className={classes.room_title}>
                {getTypeDisplayName(featuredApartments[4].type)}
              </div>
              <img
                src={featuredApartments[4].images?.[0]?.image || getTypeImage(featuredApartments[4].type)}
                alt={getTypeDisplayName(featuredApartments[4].type)}
              />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};


const RecomendationsShimmer = () => (
  <section className={classes.section_recommendations}>
    <p className={classes.title}>Most Picked</p>
    <div className={classes.images_container}>
      <div className={classes.left_image}>
        <Shimmer className={classes.image_shimmer}>
          <div />
        </Shimmer>
      </div>
      <div className={classes.images}>
        <Shimmer className={classes.image_shimmer}>
          <div />
        </Shimmer>
        <Shimmer className={classes.image_shimmer}>
          <div />
        </Shimmer>
      </div>
      <div className={classes.images}>
        <Shimmer className={classes.image_shimmer}>
          <div />
        </Shimmer>
        <Shimmer className={classes.image_shimmer}>
          <div />
        </Shimmer>
      </div>
    </div>
  </section>
)