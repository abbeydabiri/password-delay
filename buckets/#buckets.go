package buckets

import (
	"strings"

	"github.com/boltdb/bolt"

	"passworddelay/config"
)

func Init() {
	Empty("/all")
	empty("Users")
	Users{}.Setup()
}

var allowedBuckets = map[string]bool{
	"Hits":  true,
	"Users": true,
}

func BucketList(bucketName string) (bucketList []string) {
	if len(bucketName) > 0 {
		bucketName = bucketName[1:]
	}
	switch bucketName {
	default:
		bucketList = append(bucketList, "Please Specify Bucket --> Bucket "+bucketName+" Invalid!!")

	case "Hits":
		bucketList = append(bucketList, strings.Join(new(Hits).List(), "\n"))

	case "Users":
		bucketList = append(bucketList, strings.Join(new(Users).List(), "\n"))
	}
	return
}

func Empty(bucketName string) (Message []string) {

	switch bucketName {
	default:
		bucketName = bucketName[1:]
		if allowedBuckets[bucketName] {
			Message = append(Message, empty(bucketName))
			switch bucketName {
			case "Users":
				Users{}.Setup()
			}
		} else {
			Message = append(Message, "Please Specify Bucket")
		}

	case "/all":
		for bucket := range allowedBuckets {
			bucket = strings.Title(strings.ToLower(bucket))
			Message = append(Message, empty(bucket))
		}
		//Setup Users
	}
	return Message
}

func empty(bucketName string) string {
	if allowedBuckets[bucketName] {
		if err := config.Get().BoltHold.Bolt().Update(func(tx *bolt.Tx) (err error) {
			tx.DeleteBucket([]byte(bucketName))
			_, err = tx.CreateBucket([]byte(bucketName))
			return
		}); err != nil {
			return bucketName + " Bucket --> " + err.Error()
		}
		return bucketName + " Bucket -->  Emptied "
	}
	return bucketName + " Bucket -->  Does not Exist"
}
