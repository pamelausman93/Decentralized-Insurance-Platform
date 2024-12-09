;; Policy Management Contract

(define-data-var next-policy-id uint u0)

(define-map policies
  { policy-id: uint }
  {
    owner: principal,
    premium: uint,
    coverage: uint,
    start-date: uint,
    end-date: uint,
    risk-pool-id: uint,
    policy-type: (string-ascii 20),
    parameters: (list 5 (tuple (key (string-ascii 20)) (value int)))
  }
)

(define-public (create-policy
  (premium uint)
  (coverage uint)
  (start-date uint)
  (end-date uint)
  (risk-pool-id uint)
  (policy-type (string-ascii 20))
  (parameters (list 5 (tuple (key (string-ascii 20)) (value int))))
)
  (let
    (
      (policy-id (var-get next-policy-id))
    )
    (map-set policies
      { policy-id: policy-id }
      {
        owner: tx-sender,
        premium: premium,
        coverage: coverage,
        start-date: start-date,
        end-date: end-date,
        risk-pool-id: risk-pool-id,
        policy-type: policy-type,
        parameters: parameters
      }
    )
    (var-set next-policy-id (+ policy-id u1))
    (ok policy-id)
  )
)

(define-read-only (get-policy (policy-id uint))
  (ok (unwrap! (map-get? policies { policy-id: policy-id }) (err u404)))
)

(define-public (cancel-policy (policy-id uint))
  (let
    (
      (policy (unwrap! (map-get? policies { policy-id: policy-id }) (err u404)))
    )
    (asserts! (is-eq (get owner policy) tx-sender) (err u403))
    (map-delete policies { policy-id: policy-id })
    (ok true)
  )
)

