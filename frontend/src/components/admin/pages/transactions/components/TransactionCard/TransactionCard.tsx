import type { ExtendedTransaction } from "@shared/src";
import Image from "next/image";
import { useRouter } from "next/navigation";
import no_image from "@/../public/common/no-image.jpeg";
import { Shimmer } from "@/components/styles";
import classes from "./TransactionCard.module.scss";

export const TransactionCard = ({
  transaction,
}: {
  transaction: ExtendedTransaction;
}) => {
  const router = useRouter();

  return transaction.booking ? (
    <tr
      className={classes.transaction_row}
      onClick={() => router.push(`/admin/transactions/${transaction.id}`)}
    >
      <td>
        <div className={classes.name_container}>
          <Image
            src={
              transaction.booking.booking_variant.apartment.image ||
              no_image.src
            }
            alt="No Image"
            width={500}
            height={500}
            className={classes.image}
          />
          <div className={classes.info}>
            <p className={classes.name}>
              {transaction.booking.booking_variant.apartment.name}
              <span className={classes.location}>
                {transaction.booking.booking_variant.apartment.floor} -{" "}
                {transaction.booking.booking_variant.apartment.number}
              </span>
            </p>
            <p className={classes.description}>
              {transaction.booking.booking_variant.apartment.description ||
                "No description"}
            </p>
          </div>
        </div>
      </td>
      <td>
        <span
          className={classes.transaction_status}
          data-status={transaction.transaction_status.toLowerCase()}
        >
          {transaction.transaction_status.toLowerCase()}
        </span>
      </td>
      <td>
        <span className={classes.type}>{transaction.amount.toFixed(2)}</span>
      </td>
      <td className={classes.created}>
        {new Date(transaction.created).toDateString()}
      </td>
    </tr>
  ) : (
    transaction.booking_event && (
      <tr
        className={classes.transaction_row}
        onClick={() => router.push(`/admin/transactions/${transaction.id}`)}
      >
        <td>
          <div className={classes.name_container}>
            <Image
              src={transaction.booking_event.event.image || no_image.src}
              alt="No Image"
              width={500}
              height={500}
              className={classes.image}
            />
            <div className={classes.info}>
              <p className={classes.name}>
                {transaction.booking_event.event.name}
                <span className={classes.location}>
                  {new Date(
                    transaction.booking_event.event.start,
                  ).toLocaleString()}{" "}
                  -{" "}
                  {new Date(
                    transaction.booking_event.event.end,
                  ).toLocaleString()}
                </span>
              </p>
              <p className={classes.description}>
                {transaction.booking_event.event.description ||
                  "No description"}
              </p>
            </div>
          </div>
        </td>
        <td>
          <span
            className={classes.transaction_status}
            data-status={transaction.transaction_status.toLowerCase()}
          >
            {transaction.transaction_status.toLowerCase()}
          </span>
        </td>
        <td>
          <span className={classes.type}>{transaction.amount.toFixed(2)}</span>
        </td>
        <td className={classes.created}>
          {new Date(transaction.created).toDateString()}
        </td>
      </tr>
    )
  );
};

export const TransactionCardShimmer = () => (
  <tr className={classes.transaction_row}>
    <td>
      <div className={classes.name_container}>
        <Shimmer
          style={{ width: "6rem", height: "6rem", borderRadius: "4px" }}
        />
        <div className={classes.info}>
          <Shimmer
            style={{ width: "150px", height: "18px", borderRadius: "4px" }}
          />
          <Shimmer
            style={{ width: "200px", height: "14px", borderRadius: "4px" }}
          />
        </div>
      </div>
    </td>
    <td>
      <Shimmer
        style={{ width: "100px", height: "24px", borderRadius: "4px" }}
      />
    </td>
    <td>
      <Shimmer style={{ width: "90px", height: "24px", borderRadius: "4px" }} />
    </td>
    <td>
      <Shimmer
        style={{ width: "100px", height: "14px", borderRadius: "4px" }}
      />
    </td>
  </tr>
);
